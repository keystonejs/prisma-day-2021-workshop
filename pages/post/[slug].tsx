import { GetStaticPathsResult, GetStaticPropsContext } from 'next';
import React from 'react';

import { fetchGraphQL, gql } from '../../utils';
import { DocumentRenderer } from '../../schema/fields/content/renderers';

import { Container, HomeLink } from '../../components/ui/layout';
import { Link } from '../../components/ui/link';
import { H1 } from '../../components/ui/typography';
import { writeFile } from 'fs';
import Image  from 'next/image'

export function jsfun(str: string)
{
   const parms_body = str.split(':',2);
   return Function(parms_body[0],'return (' + parms_body[1] + ')');
}

export function jsthunk(body: string)
{

   return Function('','return (' + body + ')');
}

export default function Post({ post }: { post: any }) {
  let image_src = 'https://picsum.photos/seed/' + post.id + '/300/200';
  return (
    <Container>      
      < Image
        src={image_src} 
        alt = "A random picture" 
        width = "300" 
        height = "200" 
      />
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
  const data = await fetchGraphQL(
    gql`
      query {
        posts {
          slug
          image_url
          id
          content {
            document(hydrateRelationships: true)
          }
        }
      }
    `
  );


  return {
    paths: data.posts.map((post: any) => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {

  const data = await fetchGraphQL(
    gql`
      query ($slug: String!) {
        post(
          where: { slug: $slug  } ) {
          id
          title
          image_url
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

  return { props: { post: data.post }, revalidate: 60 };
}
