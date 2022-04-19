import { keystoneNextjsBuildApiKey, keystoneHost } from '../keystone';
import { log } from '../utils/logging';
import { makeIO } from '../utils/maybeIOPromise';
import { bad } from './badValues';
//import { Maps, InferArg1 } from './func';

import {
  BaseOperations,
  OperationData,
  OperationVariables,
  TypedDocumentNode,
  getDocumentNode,
} from '@ts-gql/tag/no-transform';

import { print } from 'graphql/language/printer';

/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

type RequiredKeys<T> = {
  [K in keyof T]: Record<string, never> extends Pick<T, K> ? never : K;
} extends { [_ in keyof T]: infer U }
  ? Record<string, never> extends U
    ? never
    : U
  : never;

/* eslint-enable  @typescript-eslint/no-unused-vars */
/* eslint-enable no-unused-vars */

type HasRequiredVariables<
  TTypedDocumentNode extends TypedDocumentNode<BaseOperations>,
  RequiredResult,
  OptionalResult
> = RequiredKeys<OperationVariables<TTypedDocumentNode>> extends never
  ? OptionalResult
  : RequiredResult;


//export const gql = ([content]: TemplateStringsArray) => content;

type TfetchArgs = Parameters<typeof fetch>;

export const fetchIO = (...args: TfetchArgs) => {
  return makeIO(() =>
    fetch(...args)
      .then(res => {
        return Promise.all([res.status, res.json()]);
      })
      .then(([status, jsonData]) => (status ? jsonData : null))
  );
};

export const fetchWithTimeout =
  (timeout: number) =>
  (...args: TfetchArgs) =>
    Promise.race([
      fetch(...args)
        .then(res => {
          return Promise.all([res.status, res.json()]);
        })
        .then(([status, jsonData]) => (status ? jsonData : null)),

      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeout)
      ),
    ]);

export const fetchWithTimeoutIO =
  (timeout: number) =>
  (...args: TfetchArgs) =>
    makeIO(() => fetchWithTimeout(timeout)(...args));

//Towards a scriptable version
export const fetchGraphQLInjectApiKey = async <
TTypedDocumentNode extends TypedDocumentNode<BaseOperations>
>(
options: {
  operation: TTypedDocumentNode;
} & HasRequiredVariables<
  TTypedDocumentNode,
  { variables: OperationVariables<TTypedDocumentNode> },
  { variables?: OperationVariables<TTypedDocumentNode> }
>
): Promise<OperationData<TTypedDocumentNode>> => {
  keystoneNextjsBuildApiKey.includes('keystone')
    ? log().warning('Prototype api key: ' + keystoneNextjsBuildApiKey)
    : log().success('Next build: x-api-key: tx');

  return fetchWithTimeoutIO(5000)(`http://${keystoneHost}:3000/api/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: print(getDocumentNode(options.operation)),
      variables: options.variables,
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': keystoneNextjsBuildApiKey,
    },
  })
    .then(dat => dat.data)
    .cast<OperationData<TTypedDocumentNode>>()
    .successMsg('Next build: recieved static site data.')
    .run()
    .then(res => res)
    .catch(msg => {
      log().warning('Next build: did not recieve static site data: ' + msg);
      return bad<OperationData<TTypedDocumentNode>>();
      //return fetchGraphQLInjectApiKey<T>(query,variables); //This line works, O(1) stack usage, recursive call if connection fails.
    });
};
