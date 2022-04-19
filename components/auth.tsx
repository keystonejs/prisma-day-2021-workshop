import { createContext, useRef, useEffect, useContext, ReactNode } from 'react';

import { useQuery, useMutation } from '@ts-gql/apollo';
import { gql } from '@ts-gql/tag/no-transform';

import { Maps } from '../utils/func'
import { makeIO } from '../utils/maybeIOPromise'

//Security audit:


export type SignInArgs = { email: string; password: string };
export type SignInResult =
  | { success: true }
  | { success: false; message: string };



/* eslint-enable */

type AuthContextType =
  | {
      ready: true;
      sessionData?: { id: string; name: string };

      signIn: Maps<SignInArgs,Promise<SignInResult>>;



      signOut: () => void;
    }
  | {
      ready: false;
    };

const AuthContext = createContext<AuthContextType>({
  ready: false,
});


export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const wasReady = useRef(false);


  const {
    loading,
    data: sessionData,
    error: sessionError,
  } = useQuery(
    gql`
      query AuthenticatedItem {
        authenticatedItem {
          ... on User {
            id
            name
          }
        }
      }
    ` as import('../__generated__/ts-gql/AuthenticatedItem').type
  );

    const [authenticate] = useMutation(
      gql`
        mutation AuthenticateUser($email: String!, $password: String!) {
          authenticateUserWithPassword(email: $email, password: $password) {
            __typename
            ... on UserAuthenticationWithPasswordSuccess {
              item {
                id
              }
            }
            ... on UserAuthenticationWithPasswordFailure {
              message
            }
          }
        }
      ` as import('../__generated__/ts-gql/AuthenticateUser').type
    );


  const signIn = ({ email , password }: SignInArgs): Promise<SignInResult> => {
    return makeIO(()=>authenticate(
      {
        variables: { email, password },
        refetchQueries: ['AuthenticatedItem'],
      }))
    .then (result =>
    {
      const { data } = result;
      if (
        data?.authenticateUserWithPassword?.__typename ===
        'UserAuthenticationWithPasswordSuccess'
      ) {
        return { success: true } as SignInResult;
      } else if (
        data?.authenticateUserWithPassword?.__typename ===
        'UserAuthenticationWithPasswordFailure'
      ) {
        return {
          success: false,
          message: data.authenticateUserWithPassword?.message,
        } ;
      }

      return { success: false, message: 'An unknown error occurred' };

    }
      )
    .exec({ success: false, message: 'An unknown runtime error occurred' });
  };

  const [signOutMutation] = useMutation(
    gql`
      mutation EndSession {
        endSession
      }
    ` as import('../__generated__/ts-gql/EndSession').type
  );

  const signOut = () => {
    signOutMutation({ refetchQueries: ['AuthenticatedItem'] });
  };

  useEffect(() => {
    if (!wasReady.current && !loading && !sessionError) {
      wasReady.current = true;
    }
  });

  return (
    <AuthContext.Provider
      value={{
        ready: wasReady.current || !loading,
        sessionData:
        sessionData?.authenticatedItem?.name != null
          ? {
              id: sessionData.authenticatedItem.id,
              name: sessionData.authenticatedItem.name,
            }
          : undefined,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
