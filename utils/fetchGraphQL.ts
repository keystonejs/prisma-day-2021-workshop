import { keystoneNextjsBuildApiKey, keyStoneHost } from '../keystone';
import { log } from '../utils/logging';
import { GraphQLClause } from '../wrap_any';
import { bad } from './badValues';

export const gql = ([content]: TemplateStringsArray) => content;

export const fetchGraphQLInjectApiKey = async <T>(
  query: string,
  variables?: GraphQLClause
) => {
  //Intentionally create an undefined to test HardenedAny
  //var x;
  //log().success(x);

  keystoneNextjsBuildApiKey.includes('keystone')
    ? log().warning('Prototype api key: ' + keystoneNextjsBuildApiKey)
    : log().success('Next build: x-api-key: tx');

  return fetch(`http://${keyStoneHost}:3000/api/graphql`, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': keystoneNextjsBuildApiKey,
    },
  })
    .then(x => x.json())
    .then(({ data }) => {
      log().success('Next build: json: rx');
      return data as T;
    })
    .catch(msg => {
      log().warning('Next build: did not recieve static site data: ' + msg);
      return bad<T>();
    });
};
