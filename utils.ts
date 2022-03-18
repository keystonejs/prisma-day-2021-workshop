import {
  BaseOperations,
  OperationData,
  OperationVariables,
  TypedDocumentNode,
  getDocumentNode,
} from '@ts-gql/tag/no-transform';
import { print } from 'graphql/language/printer';
import {
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  Redirect,
} from 'next';

type RequiredKeys<T> = {
  [K in keyof T]: {} extends Pick<T, K> ? never : K;
} extends { [_ in keyof T]: infer U }
  ? {} extends U
    ? never
    : U
  : never;

type HasRequiredVariables<
  TTypedDocumentNode extends TypedDocumentNode<BaseOperations>,
  RequiredResult,
  OptionalResult
> = RequiredKeys<OperationVariables<TTypedDocumentNode>> extends never
  ? OptionalResult
  : RequiredResult;

export function fetchGraphQL<
  TTypedDocumentNode extends TypedDocumentNode<BaseOperations>
>(
  options: {
    operation: TTypedDocumentNode;
  } & HasRequiredVariables<
    TTypedDocumentNode,
    { variables: OperationVariables<TTypedDocumentNode> },
    { variables?: OperationVariables<TTypedDocumentNode> }
  >
): Promise<OperationData<TTypedDocumentNode>> {
  return fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: print(getDocumentNode(options.operation)),
      variables: options.variables,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(x => x.json())
    .then(({ data, errors }) => {
      if (errors) {
        throw new Error(
          `GraphQL errors occurred:\n${errors
            .map((x: any) => x.message)
            .join('\n')}`
        );
      }
      return data;
    });
}
