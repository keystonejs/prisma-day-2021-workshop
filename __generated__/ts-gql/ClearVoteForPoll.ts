// ts-gql-integrity:bd0e8d79b1d9dabe3b9986d05ca3a4aa
/*
ts-gql-meta-begin
{
  "hash": "bf5498d541400318c890fd14d2c54a10"
}
ts-gql-meta-end
*/

import * as SchemaTypes from "./@schema";
import { TypedDocumentNode } from "@ts-gql/tag";

type ClearVoteForPollMutationVariables = SchemaTypes.Exact<{
  pollId: SchemaTypes.Scalars['ID'];
}>;


type ClearVoteForPollMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<SchemaTypes.Mutation, 'clearVoteForPoll'>
);


      
export type type = TypedDocumentNode<{
  type: "mutation";
  result: ClearVoteForPollMutation;
  variables: ClearVoteForPollMutationVariables;
  documents: SchemaTypes.TSGQLDocuments;
  fragments: SchemaTypes.TSGQLRequiredFragments<"none">
}>

declare module "./@schema" {
  interface TSGQLDocuments {
    ClearVoteForPoll: type;
  }
}

export const document = JSON.parse("{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"mutation\",\"name\":{\"kind\":\"Name\",\"value\":\"ClearVoteForPoll\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"pollId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"ID\"}}},\"directives\":[]}],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"clearVoteForPoll\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"pollId\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"pollId\"}}}],\"directives\":[]}]}}]}")
