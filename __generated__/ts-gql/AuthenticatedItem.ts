// ts-gql-integrity:e2db0eebea9740c94571ce04b3f91353
/*
ts-gql-meta-begin
{
  "hash": "6338826db77c194f27dc57cff10ddf93"
}
ts-gql-meta-end
*/

import * as SchemaTypes from "./@schema";
import { TypedDocumentNode } from "@ts-gql/tag";

type AuthenticatedItemQueryVariables = SchemaTypes.Exact<{ [key: string]: never; }>;


type AuthenticatedItemQuery = (
  { readonly __typename: 'Query' }
  & { readonly authenticatedItem: SchemaTypes.Maybe<(
    { readonly __typename: 'User' }
    & Pick<SchemaTypes.User, 'id' | 'name'>
  )> }
);


      
export type type = TypedDocumentNode<{
  type: "query";
  result: AuthenticatedItemQuery;
  variables: AuthenticatedItemQueryVariables;
  documents: SchemaTypes.TSGQLDocuments;
  fragments: SchemaTypes.TSGQLRequiredFragments<"none">
}>

declare module "./@schema" {
  interface TSGQLDocuments {
    AuthenticatedItem: type;
  }
}

export const document = JSON.parse("{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"AuthenticatedItem\"},\"variableDefinitions\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"authenticatedItem\"},\"arguments\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"User\"}},\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"arguments\":[],\"directives\":[]},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"},\"arguments\":[],\"directives\":[]}]}}]}}]}}]}")
