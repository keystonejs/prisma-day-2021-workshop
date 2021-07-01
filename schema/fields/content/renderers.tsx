import { InferRenderersForComponentBlocks } from '@keystone-next/fields-document/component-blocks';
import {
  DocumentRenderer as KeystoneDocumentRenderer,
  DocumentRendererProps,
} from '@keystone-next/document-renderer';
import React, { ComponentProps, Fragment } from 'react';

import { H1, H2, H3, H4, H5, H6, P } from '../../../components/ui/typography';
import { Divider } from '../../../components/ui/layout';
import { useAuth } from '../../../components/auth';
import { Button } from '../../../components/ui/controls';
import { Link } from '../../../components/ui/link';
import { gql, useMutation, useQuery } from 'urql';

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
    paragraph({ children, textAlign }) {
      return <P textAlign={textAlign}>{children}</P>;
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
  info: 'text-blue-800 bg-blue-50 border-blue-300',
  error: 'text-red-800 bg-red-50 border-red-300',
  warning: 'text-yellow-800 bg-yellow-50 border-yellow-300',
  success: 'text-green-800 bg-green-50 border-green-300',
};

export const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof import('./components').componentBlocks
> = {
  callout: function Callout({ appearance, content }) {
    const classes = `my-4 py-2 px-4 rounded border-l-4 ${calloutStyles[appearance]}`;
    return <div className={classes}>{content}</div>;
  },
  quote: function Quote({ content, name, position, image, href }) {
    return (
      <div className="my-4 border-l-4 border-gray-300 px-4 py-2">
        <div className="text-xl font-serif text-gray-600">{content}</div>
        <div className="mt-4 font-semibold text-gray-800">
          {href ? (
            <a href={href} target="_blank">
              {name}
            </a>
          ) : (
            name
          )}
        </div>
        <div className="text-sm text-gray-500 uppercase">{position}</div>
      </div>
    );
  },
  poll: function Poll({ poll: relatedPoll }) {
    if (!relatedPoll?.data) return null;
    const [{ data }] = useQuery({
      query: gql`
        query ($id: ID!) {
          Poll(where: { id: $id }) {
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
      `,
      variables: { id: relatedPoll.id },
    });
    const poll = (data?.Poll || relatedPoll.data) as Poll;

    const [{}, voteForPoll] = useMutation(gql`
      mutation ($answerId: ID!) {
        voteForPoll(answerId: $answerId)
      }
    `);
    const [{}, clearVoteForPoll] = useMutation(gql`
      mutation ($pollId: ID!) {
        clearVoteForPoll(pollId: $pollId)
      }
    `);
    const auth = useAuth();
    return (
      <div className="my-4">
        <div className="text-grey-800 uppercase text-lg font-semibold">
          {poll.label}
        </div>
        <form>
          {poll.answers.map(answer => {
            return (
              <label
                key={answer.id}
                className="text-grey-800 mt-2 flex items-center"
              >
                <input
                  type="radio"
                  name={poll.id}
                  value={answer.id}
                  checked={poll.userAnswer?.id === answer.id}
                  disabled={!auth.ready || !auth.sessionData}
                  onChange={() => {
                    voteForPoll(
                      { answerId: answer.id },
                      { additionalTypenames: ['Poll', 'PollAnswer'] }
                    );
                  }}
                  className="rounded-full bg-blue-200 border-2 border-blue-400 w-4 h-4 inline-block mr-4"
                />
                <span className="cursor-pointer">
                  {answer.label} {answer.voteCount} Votes
                </span>
              </label>
            );
          })}
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
              clearVoteForPoll(
                { pollId: relatedPoll.id },
                { additionalTypenames: ['Poll', 'PollAnswer'] }
              );
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
    <KeystoneDocumentRenderer
      document={document}
      renderers={renderers}
      componentBlocks={componentBlockRenderers}
    />
  );
}
