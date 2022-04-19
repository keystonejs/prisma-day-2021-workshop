import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import React from 'react';

import { gql } from '@ts-gql/tag/no-transform';
import { fetchGraphQLInjectApiKey} from '../../utils/fetchGraphQL';
import { DocumentRenderer } from '../../schema/fields/content/renderers';

import { Container, HomeLink } from '../../components/ui/layout';
//import { Link } from '../../components/ui/link';
import { H1 } from '../../components/ui/typography';
import { makeIO, pure} from '../../utils/maybeIOPromise'

export default function Post({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Container>
      <HomeLink />
      <article>
        <H1>{post?.title}</H1>
        {post?.author?.name && (
          <p>
            By <span className="font-bold">{post.author.name}</span>
          </p>
        )}
        {post?.content?.document && (
          <DocumentRenderer document={post.content.document} />
        )}
      </article>
    </Container>
  );
}


const fetchStaticPaths =  makeIO (() =>
 fetchGraphQLInjectApiKey({
  operation: gql`
    query PostSlugs {
      posts {
        id
        slug
      }
    }
  ` as import('../../__generated__/ts-gql/PostSlugs').type,
})
  .then (data => data.posts)
  .then( posts => {
    return { paths: posts?.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  } }
)
);

export const getStaticPaths = () => {
  return fetchStaticPaths
    .exec({ paths: [], fallback: 'blocking' });
}


const fetchStaticProps = (staticProps: GetStaticPropsContext) =>

  pure(staticProps)
  .then (props => props.params)
  .then (params => params.slug as string)
  .promise(slug =>
    fetchGraphQLInjectApiKey({
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
      variables: { slug: slug},
    }))
    .then (data => data.post)
    ;


export const getStaticProps = ( params : GetStaticPropsContext) => {
  return fetchStaticProps(params)
    .run ()
    .then(match_post => {
      return { props: { post: match_post }, revalidate: 60 }})
};
