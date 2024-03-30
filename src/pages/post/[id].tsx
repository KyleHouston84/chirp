import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { api } from '~/utils/api';
import { PageLayout } from '~/components/layout';
import { LoadingPage } from '~/components/loading';
import { PostView } from '~/components/postView';
import { generateServerSideHelper } from '~/server/helpers/serverSideHelper';

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.post.getById.useQuery({
    id,
  });

  if (!data) return <div></div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <div className='SinglePostView'>
          <PostView {...data} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  const helpers = generateServerSideHelper();

  const id = context.params?.id;

  if (typeof id !== 'string') throw new Error('no id');

  await helpers.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export default SinglePostPage;
