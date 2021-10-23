import React from 'react';


import { fetchGraphQL_inject_api_key, gql } from '../utils/fetchGraphQL';
import { DocumentRenderer } from '../schema/fields/content/renderers';

import { Container } from '../components/ui/layout';
import { Link } from '../components/ui/link';
import { H1 } from '../components/ui/typography';
import { useAuth } from '../components/auth';

import { makeIO } from '../utils/maybeIOPromise'

import { DocumentAny } from '../wrap_any'



export default function Home({ posts }: { posts: QueryPost[] }) {
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

export type QueryPost = {
  id: string;  
  title: string;
  slug: string;
  publishedDate: string;
  intro: {
    document: DocumentAny;
  };
  author: {
    name: string;
  };
};

export type QueryPosts = {
  posts: QueryPost[]
}



//We can save a little time by compiling the functional code to a runtime constant
const fetchScript = makeIO (() => 
  fetchGraphQL_inject_api_key<QueryPosts>(
    gql`
      query {
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
    `
  ))
  .then (data => data.posts);

export async function getStaticProps() {
  return fetchScript
    .info ()
    .exec ([])
    .then (postsRx => { return { props: { posts: postsRx }, revalidate: 60 } })
}
