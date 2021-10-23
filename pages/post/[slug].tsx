import { GetStaticPropsContext } from 'next';
import React from 'react';

import { fetchGraphQL_inject_api_key, gql } from '../../utils/fetchGraphQL';
import { DocumentRenderer } from '../../schema/fields/content/renderers';

import { Container, HomeLink } from '../../components/ui/layout';
//import { Link } from '../../components/ui/link';
import { H1 } from '../../components/ui/typography';

//import { PostAny } from '../../wrap_any'
import { log } from '../../utils/logging'
import { makeIO, IO, embed } from '../../utils/maybeIOPromise'
import { DocumentAny } from '../../wrap_any'



export default function RenderPost({ post }: { post: PostStaticProps }) {
  return (
    <Container>
      <HomeLink />
      <article>
        <H1>{post.title}</H1>
        {post.author.name && (
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


type TstaticPaths = {
  posts:
  {
    slug: string;
  }[];
};

const fetchStaticPaths =  makeIO (() => fetchGraphQL_inject_api_key<TstaticPaths>(
  gql`
    query {
        posts {
          slug
        }
      }
    `
  ))
  .then (data => data.posts)

  .then( posts => {
    return { paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  } } 
)


export async function getStaticPaths() {
  return fetchStaticPaths
    .exec({ paths: [], fallback: 'blocking' });
}

export type PostStaticProps = {
  title: string;

  content: {
    document: DocumentAny;
  };
  publishedDate: string;
  author: {
    id: string;
    name: string;
  };
};

export type QueryPostStaticProps = {post: PostStaticProps};



const fetchStaticProps = (staticProps: GetStaticPropsContext) => 

  IO.root(staticProps) 
  .then (props => props.params)
  .then (params => params.slug )
  .promise(pslug => 
    fetchGraphQL_inject_api_key<QueryPostStaticProps>(
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
    { slug: pslug }))
    //.info()
    .then (data => data.post)
    ;


    //.then (postsRx => { return { props: { posts: postsRx }, revalidate: 60 } })

export async function getStaticProps( params : GetStaticPropsContext) {
  return fetchStaticProps(params)
    .run ()
    .then(match_post => {
      return { props: { post: match_post }, revalidate: 60 }})

    
}
