import { GetStaticPropsContext } from 'next';
import React from 'react';
import { fetchGraphQLInjectApiKey, gql } from '../../utils/fetchGraphQL';
import { DocumentRenderer } from '../../schema/fields/content/renderers';
import { Container, HomeLink } from '../../components/ui/layout';
//import { Link } from '../../components/ui/link';
import { H1 } from '../../components/ui/typography';
//import { PostAny } from '../../wrap_any'
import { makeIO, pure} from '../../utils/maybeIOPromise'
import { DocumentAny } from '../../wrap_any'

const RenderPost = ({ post }: { post: PostStaticProps }) =>  {
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
export default RenderPost;

type TstaticPaths = {
  posts:
  {
    slug: string;
  }[];
};

const fetchStaticPaths =  makeIO (() =>
 fetchGraphQLInjectApiKey<TstaticPaths>(
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

export const getStaticPaths = () => {
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

  pure(staticProps)
  .then (props => props.params)
  .then (params => params.slug )
  .promise(slug =>
    fetchGraphQLInjectApiKey<QueryPostStaticProps>(
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
    { slug: slug }))
    .then (data => data.post)
    ;


    //.then (postsRx => { return { props: { posts: postsRx }, revalidate: 60 } })

export const getStaticProps = ( params : GetStaticPropsContext) => {
  return fetchStaticProps(params)
    .run ()
    .then(match_post => {
      return { props: { post: match_post }, revalidate: 60 }})


}
