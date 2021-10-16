import { GetStaticPathsResult, GetStaticPropsContext } from 'next';
import React from 'react';

import { fetchGraphQL_inject_api_key, gql } from '../../utils/fetchGraphQL';
import { DocumentRenderer } from '../../schema/fields/content/renderers';

import { Container, HomeLink } from '../../components/ui/layout';
import { Link } from '../../components/ui/link';
import { H1 } from '../../components/ui/typography';

import { HardenedAny } from '../../wrap_any'

export default function Post({ post }: { post: any }) {
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
  const data = await fetchGraphQL_inject_api_key(
    gql`
      query {
        posts {
          slug
        }
      }
    `
  );
  if (data === undefined || data.posts === undefined)
    return {  paths: [].map((post: HardenedAny) => ({ params: { slug: "" } })),
  fallback: false,};

  return {
    paths: data!.posts!.map((post: HardenedAny) => ({ params: { slug: post?.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const data = await fetchGraphQL_inject_api_key(
    gql`
      query ($slug: String!) {
        post(where: { slug: $slug }) {
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
  return { props: { post: data!.post }, revalidate: 60 };
}
