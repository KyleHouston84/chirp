import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

import { api } from '~/utils/api';
import toast from 'react-hot-toast';

export const CreatePostWizard = (props: { postId?: string }) => {
  const { postId } = props;
  const { user } = useUser();

  const ctx = api.useUtils();

  const { mutate: incrementMutate, isLoading: isIncrementing } =
    api.post.incrementPostReplyCount.useMutation({
      onSuccess: () => console.log('SUCCESSFUL INCREMENT'),
      onError: () => console.log('INCREMENT ERROR'),
    });

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput('');
      if (postId) {
        incrementMutate({ id: postId });
      }
      void ctx.post.getRepliesById.invalidate();
      void ctx.post.getAllOriginalPosts.invalidate();
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
    <div className='flex w-full gap-3 border-b border-slate-400 p-4'>
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
        disabled={isPosting || isIncrementing}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (input !== '') {
              mutate({ content: input, replyToId: postId || '' });
            }
          }
        }}
      />
      <button
        disabled={isPosting || isIncrementing}
        onClick={() => mutate({ content: input, replyToId: postId || '' })}
      >
        {postId ? 'Reply' : 'Post'}
      </button>
    </div>
  );
};
