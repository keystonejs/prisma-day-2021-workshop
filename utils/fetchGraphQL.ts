import { keystoneNextjsBuildApiKey, keystoneHost } from '../keystone';
import { log } from '../utils/logging';
import { makeIO } from '../utils/maybeIOPromise';
import { GraphQLClause } from '../wrap_any';
import { bad } from './badValues';
//import { Maps, InferArg1 } from './func';

export const gql = ([content]: TemplateStringsArray) => content;

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
export const fetchGraphQLInjectApiKey = async <T>(
  query: string,
  variables?: GraphQLClause
): Promise<T> => {
  keystoneNextjsBuildApiKey.includes('keystone')
    ? log().warning('Prototype api key: ' + keystoneNextjsBuildApiKey)
    : log().success('Next build: x-api-key: tx');

  return fetchWithTimeoutIO(5000)(`http://${keystoneHost}:3000/api/graphql`, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': keystoneNextjsBuildApiKey,
    },
  })
    .then(dat => dat.data)
    .cast<T>()
    .successMsg('Next build: recieved static site data.')
    .run()
    .then(res => res)
    .catch(msg => {
      log().warning('Next build: did not recieve static site data: ' + msg);
      return bad<T>();
      //return fetchGraphQLInjectApiKey<T>(query,variables); //This line works, O(1) stack usage, recursive call if connection fails.
    });
};
