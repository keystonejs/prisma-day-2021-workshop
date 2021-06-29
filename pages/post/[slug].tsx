import { GetStaticPathsResult, GetStaticPropsContext } from 'next';
import React from 'react';
import {
  DocumentRenderer,
  DocumentRendererProps,
} from '@keystone-next/document-renderer';
import { InferRenderersForComponentBlocks } from '@keystone-next/fields-document/component-blocks';
import { fetchGraphQL, gql } from '../../utils';

import { Container } from '../../components/ui/layout';
import { Link } from '../../components/ui/link';
import { H1 } from '../../components/ui/typography';
import { ChevronLeft } from '../../components/ui/icons';

// by default the DocumentRenderer will render unstyled html elements
// we're customising how headings are rendered here but you can customise any of the renderers that the DocumentRenderer uses
const renderers: DocumentRendererProps['renderers'] = {
  block: {
    heading({ level, children, textAlign }) {
      const Comp = `h${level}` as const;
      return (
        <Comp style={{ textAlign, textTransform: 'uppercase' }}>
          {children}
        </Comp>
      );
    },
  },
};

const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof import('../../fields/Content').componentBlocks
> = {
  callout: function Callout({ appearance, content }) {
    return <div>{content}</div>;
  },
  quote: function Quote({ content, name, position }) {
    return <div>{content}</div>;
  },
  poll: function Poll({ poll }) {
    return <pre>{JSON.stringify(poll, null, 2)}</pre>;
  },
};

export default function Post({ post }: { post: any }) {
  return (
    <Container>
      <div>
        <Link href="/" className="flex hover:no-underline">
          <ChevronLeft />
          Go Home
        </Link>
      </div>
      <hr className="my-4" />
      <article>
        <H1>{post.title}</H1>
        {post.author?.name && (
          <p>
            By{' '}
            <Link href={`/author/${post.author.id}`}>
              <a>{post.author.name}</a>
            </Link>
          </p>
        )}
        {post.publishedDate && (
          <span>
            on <time dateTime={post.publishedDate}>{post.publishedDate}</time>
          </span>
        )}
        {post.content?.document && (
          <DocumentRenderer
            document={post.content.document}
            renderers={renderers}
            componentBlocks={componentBlockRenderers}
          />
        )}
      </article>
    </Container>
  );
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const data = await fetchGraphQL(
    gql`
      query {
        allPosts {
          slug
        }
      }
    `
  );
  return {
    paths: data.allPosts.map((post: any) => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const data = await fetchGraphQL(
    gql`
      query ($slug: String!) {
        Post(where: { slug: $slug }) {
          title
          content {
            document(hydrateRelationships: true)
          }
          publishedDate
          author {
            id
            name
          }
        }
      }
    `,
    { slug: params!.slug }
  );
  return { props: { post: data.Post }, revalidate: 60 };
}
