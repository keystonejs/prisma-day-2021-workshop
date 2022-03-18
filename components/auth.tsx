import { createContext, useRef, useEffect, useContext, ReactNode } from 'react';

import { useQuery, useMutation } from '@ts-gql/apollo';
import { gql } from '@ts-gql/tag/no-transform';

export type SignInArgs = { email: string; password: string };
export type SignInResult =
  | { success: true }
  | { success: false; message: string };

type AuthContextType =
  | {
      ready: true;
      sessionData?: { id: string; name: string };
      signIn: ({ email, password }: SignInArgs) => Promise<SignInResult>;
      signOut: () => void;
    }
  | {
      ready: false;
    };

const AuthContext = createContext<AuthContextType>({
  ready: false,
});

export function useAuth() {
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

  const signIn = async ({
    email,
    password,
  }: SignInArgs): Promise<SignInResult> => {
    try {
      const result = await authenticate({ variables: { email, password } });
      const { data } = result;
      if (
        data?.authenticateUserWithPassword?.__typename ===
        'UserAuthenticationWithPasswordSuccess'
      ) {
        return { success: true };
      } else if (
        data?.authenticateUserWithPassword?.__typename ===
        'UserAuthenticationWithPasswordFailure'
      ) {
        return {
          success: false,
          message: data.authenticateUserWithPassword?.message,
        };
      }
      return { success: false, message: 'An unknown error occurred' };
    } catch (err: any) {
      return { success: false, message: err.toString() };
    }
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
