import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { type RouterOutputs, api } from '~/utils/api';
import Link from 'next/link';

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs['post']['getAll'][number];
export const PostView = (props: PostWithUser) => {
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
