import { useState } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';

import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loading';
import toast from 'react-hot-toast';

import { PageLayout } from '~/components/layout';
import { PostView } from '~/components/postView';
import { CreatePostWizard } from '~/components/createPostWizard';

const Feed = () => {
  const { data, isLoading: postsLoading } =
    api.post.getAllOriginalPosts.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong...</div>;

  return (
    <div className='flex flex-col'>
      {data?.map(fullPost => <PostView key={fullPost.post.id} {...fullPost} />)}
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching early
  api.post.getAllOriginalPosts.useQuery();

  return (
    <PageLayout>
      {!isSignedIn && (
        <div className='flex border-b border-slate-400 p-4'>
          <div className='flex justify-center'>
            <SignInButton />
          </div>
        </div>
      )}
      {isSignedIn && <CreatePostWizard />}
      <Feed />
    </PageLayout>
  );
}
