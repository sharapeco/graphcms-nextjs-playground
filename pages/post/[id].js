import { gql } from 'graphql-request';

// https://graphcms.com/blog/graphcms-react-rich-text-renderer
import { RichText } from '@graphcms/rich-text-react-renderer';

// https://github.com/GraphCMS/react-image
import Image from "@graphcms/react-image";

import graphCmsClient from '../../lib/graphCmsClient';

function ProductPage({ post }) {
  return <>
    <h1>{post.title}</h1>
    {post.cover && <Image image={post.cover} maxWidth={720} />}
    {post.introduction.map((intro) => (
      <section>
        <h2>{intro.heading}</h2>
        <RichText content={intro.body.raw} />
      </section>
    ))}
    <hr/>
    <pre>{JSON.stringify(post, null, 2)}</pre>
  </>;
}

export async function getStaticPaths({ locales }) {
  let paths = [];

  const { posts } = await graphCmsClient.request(gql`
    {
      posts {
        id
      }
    }
  `);

  for (const locale of locales) {
    paths = [
      ...paths,
      ...posts.map((post) => ({ params: { id: post.id }, locale })),
    ];
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ locale, params }) {
  const { post } = await graphCmsClient.request(
    gql`
      query PostPageQuery($id: ID!, $locale: Locale!) {
        post(where: { id: $id }, locales: [$locale]) {
          id
          title
          cover {
            handle
            width
            height
          }
          introduction {
            id
            heading
            body {
              raw
            }
            figure {
              handle
              width
              height
            }
          }
        }
      }
    `,
    { id: params.id, locale }
  );

  return {
    props: {
      post,
    },
  };
}

export default ProductPage;
