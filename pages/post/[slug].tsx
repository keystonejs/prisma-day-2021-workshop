import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import React from 'react';

import { gql } from '@ts-gql/tag/no-transform';
import { fetchGraphQL } from '../../utils';
import { DocumentRenderer } from '../../schema/fields/content/renderers';

import { Container, HomeLink } from '../../components/ui/layout';
import { Link } from '../../components/ui/link';
import { H1 } from '../../components/ui/typography';

export default function Post({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Container>
      <HomeLink />
      <article>
        <H1>{post.title}</H1>
        {post.author?.name && (
          <p>
            By <span className="font-bold">{post.author.name}</span>
          </p>
        )}
        {post.content?.document && (
          <DocumentRenderer document={post.content.document} />
        )}
      </article>
    </Container>
  );
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const data = await fetchGraphQL({
    operation: gql`
      query PostSlugs {
        posts {
          id
          slug
        }
      }
    ` as import('../../__generated__/ts-gql/PostSlugs').type,
  });
  return {
    paths: data.posts!.map(post => ({ params: { slug: post.slug! } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const data = await fetchGraphQL({
    operation: gql`
      query PostPage($slug: String!) {
        post(where: { slug: $slug }) {
          id
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
    ` as import('../../__generated__/ts-gql/PostPage').type,
    variables: { slug: params!.slug as string },
  });

  return { props: { post: data.post! }, revalidate: 60 };
}
