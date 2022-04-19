// ts-gql-integrity:f67ecba196b94d03117e27cb7b4a97d3
/*
ts-gql-meta-begin
{
  "hash": "db1debd44cd5070c94cad72c70c58217"
}
ts-gql-meta-end
*/

import * as SchemaTypes from "./@schema";
import { TypedDocumentNode } from "@ts-gql/tag";

type EndSessionMutationVariables = SchemaTypes.Exact<{ [key: string]: never; }>;


type EndSessionMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<SchemaTypes.Mutation, 'endSession'>
);


      
export type type = TypedDocumentNode<{
  type: "mutation";
  result: EndSessionMutation;
  variables: EndSessionMutationVariables;
  documents: SchemaTypes.TSGQLDocuments;
  fragments: SchemaTypes.TSGQLRequiredFragments<"none">
}>

declare module "./@schema" {
  interface TSGQLDocuments {
    EndSession: type;
  }
}

export const document = JSON.parse("{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"mutation\",\"name\":{\"kind\":\"Name\",\"value\":\"EndSession\"},\"variableDefinitions\":[],\"directives\":[],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"endSession\"},\"arguments\":[],\"directives\":[]}]}}]}")
