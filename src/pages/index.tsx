import { useState } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { type RouterOutputs, api } from '~/utils/api';
import { LoadingPage } from '~/components/loading';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { PageLayout } from '~/components/layout';

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useUtils();

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput('');
      void ctx.post.getAll.invalidate();
    },
    onError: e => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage) {
        toast.error(errorMessage[0] ?? 'No message found');
      } else {
        toast.error('Too many attempts, try again later');
      }
    },
  });

  const [input, setInput] = useState('');

  if (!user) return null;

  return (
    <div className='flex w-full gap-3'>
      <Image
        src={user.imageUrl}
        alt='profile image'
        className='h-16 w-16 rounded-full'
        width={56}
        height={56}
      />
      <input
        placeholder='Type some emojis!!'
        className='grow bg-transparent outline-none'
        value={input}
        type='text'
        onChange={e => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (input !== '') {
              mutate({ content: input });
            }
          }
        }}
      />
      <button disabled={isPosting} onClick={() => mutate({ content: input })}>
        Post
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs['post']['getAll'][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className='flex gap-3 border-b border-slate-400 p-4' key={post.id}>
      <Image
        src={author.imageUrl}
        alt={`@${author.username}'s profile picture`}
        className='h-16 w-16 rounded-full'
        width={56}
        height={56}
      />
      <div className='flex flex-col'>
        <div className='flex gap-1 text-slate-300'>
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className='font-thin'>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className='text-2xl'>{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

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
  api.post.getAll.useQuery();

  return (
    <PageLayout>
      <div className='flex border-b border-slate-400 p-4'>
        {!isSignedIn && (
          <div className='flex justify-center'>
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
}
