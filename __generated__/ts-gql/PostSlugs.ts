// ts-gql-integrity:1240716266bac4934d2136f5b570c00a
/*
ts-gql-meta-begin
{
  "hash": "6580fc6306bfe496f66033257cd487a3"
}
ts-gql-meta-end
*/

import * as SchemaTypes from "./@schema";
import { TypedDocumentNode } from "@ts-gql/tag";

type PostSlugsQueryVariables = SchemaTypes.Exact<{ [key: string]: never; }>;


type PostSlugsQuery = (
  { readonly __typename: 'Query' }
  & { readonly posts: SchemaTypes.Maybe<ReadonlyArray<(
    { readonly __typename: 'Post' }
    & Pick<SchemaTypes.Post, 'id' | 'slug'>
  )>> }
);


      
export type type = TypedDocumentNode<{
  type: "query";
  result: PostSlugsQuery;
  variables: PostSlugsQueryVariables;
  documents: SchemaTypes.TSGQLDocuments;
  fragments: SchemaTypes.TSGQLRequiredFragments<"none">
}>

declare module "./@schema" {
  interface TSGQLDocuments {
    PostSlugs: type;
  }
}

export const document = JSON.parse("{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"PostSlugs\"},\"variableDefinitions\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"posts\"},\"arguments\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"arguments\":[],\"directives\":[]},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"slug\"},\"arguments\":[],\"directives\":[]}]}}]}}]}")
