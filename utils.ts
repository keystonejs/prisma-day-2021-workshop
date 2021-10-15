import { keystoneNextjsBuildApiKey, keyStoneHost, log } from './keystone';
import { HardenedAny } from './wrap_any';
export const gql = ([content]: TemplateStringsArray) => content;

export async function fetchGraphQL_inject_api_key(
  query: string,
  variables?: Record<string, HardenedAny>
) {
  //Intentionally create an undefined to test HardenedAny
  //var x;
  //log.success(x);

  keystoneNextjsBuildApiKey.includes('keystone')
    ? log.warning('Prototype api key: ' + keystoneNextjsBuildApiKey)
    : log.success('Next build: x-api-key: tx');

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
      log.success('Next build: json: rx');
      return data;
    })
    .catch(msg =>
      log.error(
        'Next build: did not recieve static site data: ' + log.sep + msg
      )
    );
}
