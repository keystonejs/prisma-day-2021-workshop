// ts-gql-integrity:64638c2dc5c100f8c6373aea354197d2
/*
ts-gql-meta-begin
{
  "hash": "bcfe9a5d1d8b7dcdeaebab065ab0a8b3"
}
ts-gql-meta-end
*/

import * as SchemaTypes from "./@schema";
import { TypedDocumentNode } from "@ts-gql/tag";

type AuthenticateUserMutationVariables = SchemaTypes.Exact<{
  email: SchemaTypes.Scalars['String'];
  password: SchemaTypes.Scalars['String'];
}>;


type AuthenticateUserMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly authenticateUserWithPassword: SchemaTypes.Maybe<(
    { readonly __typename: 'UserAuthenticationWithPasswordSuccess' }
    & { readonly item: (
      { readonly __typename: 'User' }
      & Pick<SchemaTypes.User, 'id'>
    ) }
  ) | (
    { readonly __typename: 'UserAuthenticationWithPasswordFailure' }
    & Pick<SchemaTypes.UserAuthenticationWithPasswordFailure, 'message'>
  )> }
);


      
export type type = TypedDocumentNode<{
  type: "mutation";
  result: AuthenticateUserMutation;
  variables: AuthenticateUserMutationVariables;
  documents: SchemaTypes.TSGQLDocuments;
  fragments: SchemaTypes.TSGQLRequiredFragments<"none">
}>

declare module "./@schema" {
  interface TSGQLDocuments {
    AuthenticateUser: type;
  }
}

export const document = JSON.parse("{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"mutation\",\"name\":{\"kind\":\"Name\",\"value\":\"AuthenticateUser\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"email\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}},\"directives\":[]},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"password\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}},\"directives\":[]}],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"authenticateUserWithPassword\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"email\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"email\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"password\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"password\"}}}],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"__typename\"},\"arguments\":[],\"directives\":[]},{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"UserAuthenticationWithPasswordSuccess\"}},\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"item\"},\"arguments\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"arguments\":[],\"directives\":[]}]}}]}},{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"UserAuthenticationWithPasswordFailure\"}},\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"message\"},\"arguments\":[],\"directives\":[]}]}}]}}]}}]}")
