import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import {
  DocumentRenderer as KeystoneDocumentRenderer,
  DocumentRendererProps,
} from '@keystone-6/document-renderer';
import { InferRenderersForComponentBlocks } from '@keystone-6/fields-document/component-blocks';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@ts-gql/tag/no-transform';
import { ComponentProps, Fragment } from 'react';
import { useAuth } from '../../../components/auth';
import { Button } from '../../../components/ui/controls';
import { Divider } from '../../../components/ui/layout';
import { Link } from '../../../components/ui/link';
import { H1, H2, H3, H4, H5, H6 } from '../../../components/ui/typography';

// by default the DocumentRenderer will render unstyled html elements
// we're customising how headings are rendered here but you can customise any of the renderers that the DocumentRenderer uses
export const renderers: DocumentRendererProps['renderers'] = {
  block: {
    heading({ level, children, textAlign }) {
      switch (level) {
        case 1:
          return <H1 textAlign={textAlign}>{children}</H1>;
        case 2:
          return <H2 textAlign={textAlign}>{children}</H2>;
        case 3:
          return <H3 textAlign={textAlign}>{children}</H3>;
        case 4:
          return <H4 textAlign={textAlign}>{children}</H4>;
        case 5:
          return <H5 textAlign={textAlign}>{children}</H5>;
        default:
          return <H6 textAlign={textAlign}>{children}</H6>;
      }
    },
    divider() {
      return <Divider />;
    },
  },
};

type Answer = {
  id: string;
  label: string;
  voteCount: number;
};
type Poll = {
  id: string;
  label: string;
  answers: Answer[];
  userAnswer: { id: string } | null;
};

const calloutStyles = {
  info: 'bg-blue-50 text-blue-700',
  error: 'bg-red-50 text-red-700',
  warning: 'bg-warning-50 text-warning-700',
  success: 'bg-green-50 text-green-700',
};

const calloutIcons = {
  info: InformationCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
};

export const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof import('./components').componentBlocks
> = {
  callout: function Callout({ appearance, content }) {
    const Icon = calloutIcons[appearance];
    return (
      <div className={`not-prose rounded-md p-4 ${calloutStyles[appearance]}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5 fill-current" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm">{content}</p>
          </div>
        </div>
      </div>
    );
  },
  quote: function Quote({ content, name, position, image, href }) {
    return (
      <div className="my-4 border-l-4 border-gray-300 px-4 py-2">
        <div className="font-serif text-xl text-gray-600">{content}</div>
        <div className="mt-4 font-semibold text-gray-800">
          {href ? (
            <a href={href} target="_blank">
              {name}
            </a>
          ) : (
            name
          )}
        </div>
        <div className="text-sm uppercase text-gray-500">{position}</div>
      </div>
    );
  },
  poll: function Poll({ poll: relatedPoll }) {
    if (!relatedPoll?.data) return null;
    const { data } = useQuery(
      gql`
        query Poll($id: ID!) {
          poll(where: { id: $id }) {
            id
            label
            answers {
              id
              label
              voteCount
            }
            userAnswer {
              id
            }
          }
        }
      ` as import('../../../__generated__/ts-gql/Poll').type,
      { variables: { id: relatedPoll.id } }
    );
    const poll = (data?.poll || relatedPoll.data) as Poll;

    const [voteForPoll] = useMutation(
      gql`
        mutation VoteForPoll($answerId: ID!) {
          voteForPoll(answerId: $answerId)
        }
      ` as import('../../../__generated__/ts-gql/VoteForPoll').type
    );
    const [clearVoteForPoll] = useMutation(
      gql`
        mutation ClearVoteForPoll($pollId: ID!) {
          clearVoteForPoll(pollId: $pollId)
        }
      ` as import('../../../__generated__/ts-gql/ClearVoteForPoll').type
    );
    const auth = useAuth();
    return (
      <div className="my-4">
        <form>
          <fieldset>
            <legend className="text-sm font-medium text-gray-900 uppercase tracking-wide">
              {poll.label}
            </legend>
            <div className="flex flex-col gap-2 py-3 max-w-sm">
              {poll.answers.map(answer => {
                return (
                  <label
                    key={answer.id}
                    className="flex items-center border p-2 rounded-md cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <input
                      type="radio"
                      name={poll.id}
                      value={answer.id}
                      checked={poll.userAnswer?.id === answer.id}
                      disabled={!auth.ready || !auth.sessionData}
                      onChange={() => {
                        voteForPoll({
                          variables: { answerId: answer.id },
                          refetchQueries: ['Poll'],
                        });
                      }}
                      className="focus:ring-0"
                    />
                    <span className="ml-3 flex flex-1 justify-between text-sm font-medium text-gray-700">
                      <span>{answer.label}</span>
                      <span className="text-gray-500">
                        {answer.voteCount} Votes
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </form>
        {auth.ready && !auth.sessionData && (
          <Fragment>
            <Link href="/signin">Sign In</Link> or{' '}
            <Link href="/signup">Join</Link> to vote
          </Fragment>
        )}
        {poll.userAnswer?.id && (
          <Button
            onClick={() => {
              clearVoteForPoll({
                variables: { pollId: relatedPoll.id },
                refetchQueries: ['Poll'],
              });
            }}
          >
            Clear Vote
          </Button>
        )}
      </div>
    );
  },
};

export function DocumentRenderer({
  document,
}: Pick<ComponentProps<typeof KeystoneDocumentRenderer>, 'document'>) {
  return (
    <div className="prose">
      <KeystoneDocumentRenderer
        document={document}
        renderers={renderers}
        componentBlocks={componentBlockRenderers}
      />
    </div>
  );
}
