import { gql } from 'graphql-request';
import Link from 'next/link'

import graphCmsClient from '../lib/graphCmsClient';

function IndexPage({ posts }) {
  return (
    <>
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
          >
            <Link href={`/post/${post.id}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <hr/>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const { posts } = await graphCmsClient.request(
    gql`
      query IndexPageQuery($locale: Locale!) {
        posts(locales: [$locale]) {
          id
          title
        }
      }
    `,
    { locale }
  );

  return {
    props: {
      posts,
    },
  };
}

export default IndexPage;
