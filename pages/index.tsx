import React, { useState } from 'react';
import { GetStaticPropsContext } from 'next';

import { fetchGraphQL, gql } from '../utils';

import { Container } from '../components/ui/layout';
import { Link } from '../components/ui/link';
import { H1 } from '../components/ui/typography';
import { useAuth } from '../components/auth';

type Post = {
  id: string;
  slug: string;
  title: string;
  author: {
    name: string;
  };
};

export default function Home({ posts }: { posts: Post[] }) {
  const auth = useAuth();
  return (
    <Container>
      <H1>My Blog</H1>
      {auth.ready && auth.sessionData ? (
        <p>
          You're signed in as {auth.sessionData.name} |{' '}
          <button onClick={() => auth.signOut()}>sign out</button>
        </p>
      ) : (
        <p>
          <Link href="/signin">Sign In</Link> | <Link href="/signup">Join</Link>
        </p>
      )}

      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/post/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const data = await fetchGraphQL(
    gql`
      query {
        allPosts(where: { status: "published" }) {
          id
          title
          slug
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
    `
  );
  console.log(data);
  return { props: { posts: data.allPosts }, revalidate: 60 };
}
