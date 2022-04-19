import React from 'react';
import { InferGetStaticPropsType } from 'next';

import { gql } from '@ts-gql/tag/no-transform';
import { fetchGraphQLInjectApiKey } from '../utils/fetchGraphQL';
import { DocumentRenderer } from '../schema/fields/content/renderers';

import { Container } from '../components/ui/layout';
import { Link } from '../components/ui/link';
import { H1 } from '../components/ui/typography';
import { useAuth } from '../components/auth';
import { makeIO } from '../utils/maybeIOPromise'

export default function Home({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const auth = useAuth();
  return (
    <Container>
      <H1>My Blog</H1>
      {auth.ready && auth.sessionData ? (
        <p>
          You&apos;re signed in as {auth.sessionData.name} |{' '}
          <button onClick={() => auth.signOut()}>sign out</button>
        </p>
      ) : (
        <p>
          <Link href="/signin">Sign In</Link> | <Link href="/signup">Join</Link>
        </p>
      )}

      <div>
        {posts?.map(post => {
          const date = post.publishedDate
            ? new Date(post.publishedDate).toLocaleDateString()
            : null;
          return (
            <div key={post.id} className="my-8">
              <div className="text-gray-500 text-sm font-medium">{date}</div>
              <h2 className="text-xl text-gray-800 my-2 font-medium">
                {post.title}
              </h2>
              {post.intro?.document && (
                <DocumentRenderer document={post.intro.document} />
              )}
              <div className="my-2">
                <Link href={`/post/${post.slug}`}>Read the full story</Link>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

const fetchAllPostsForIndex = makeIO (() =>
  fetchGraphQLInjectApiKey({
    operation: gql`
      query AllPosts {
        posts(
          where: { status: { equals: "published" } }
          orderBy: [{ publishedDate: desc }]
        ) {
          id
          title
          slug
          publishedDate
          intro {
            document(hydrateRelationships: true)
          }
          author {
            id
            name
          }
        }
      }
    ` as import('../__generated__/ts-gql/AllPosts').type,
  }))
  .then (data => data.posts);


  export const getStaticProps = () => {
    return fetchAllPostsForIndex
      .exec ([])
      .then (postsRx => { return { props: { posts: postsRx }, revalidate: 60 } })
  }
