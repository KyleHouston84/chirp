import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { api } from '~/utils/api';
import { PageLayout } from '~/components/layout';
import { LoadingPage } from '~/components/loading';
import { PostView } from '~/components/postView';
import { generateServerSideHelper } from '~/server/helpers/serverSideHelper';
import { CreatePostWizard } from '~/components/createPostWizard';

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: postData, isLoading: postLoading } = api.post.getById.useQuery({
    id,
  });
  const { data: replyData, isLoading: repliesLoading } =
    api.post.getRepliesById.useQuery({
      id,
    });

  if (!postData) return <div></div>;
  if (postLoading) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>{`${postData.post.content} - @${postData.author.username}`}</title>
      </Head>
      <PageLayout>
        <div>
          <div className='SinglePostView'>
            <PostView {...postData} />
          </div>
          <CreatePostWizard postId={id} />
          {repliesLoading ? (
            <LoadingPage />
          ) : (
            replyData?.map(reply => <PostView {...reply} key={reply.post.id} />)
          )}
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
