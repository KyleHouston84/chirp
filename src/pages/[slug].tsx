import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { api } from '~/utils/api';

import { PageLayout } from '~/components/layout';
import { LoadingPage } from '~/components/loading';
import { PostView } from '~/components/postView';
import { generateServerSideHelper } from '~/server/helpers/serverSideHelper';

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not yet posted</div>;

  return (
    <div className='flex flex-col'>
      {data.map(fullpost => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div></div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className='relative h-36 bg-slate-600'>
          <img
            src={data.imageUrl}
            alt={`${data.username ?? ''}'s profile pic`}
            width={128}
            height={128}
            className='absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black'
          />
        </div>
        <div className='h-[64px]'></div>
        <div className='p-4 text-2xl font-bold'>{`@${data.username ?? ''}`}</div>
        <div className='b-4 border-b border-slate-400'></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  const helpers = generateServerSideHelper();

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error('no slug');

  const username = slug.replace('@', '');

  await helpers.profile.getUserByUsername.prefetch({ username: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export default ProfilePage;
