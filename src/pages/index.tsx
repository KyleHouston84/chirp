import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Head from 'next/head'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { RouterOutputs, api } from '~/utils/api'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  if (!user) return null

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
      />
    </div>
  )
}

type PostWithUser = RouterOutputs['post']['getAll'][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props
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
          <span>{`@${author.username}`}</span>
          <span className='font-thin'>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useUser()
  console.log('USER', user)

  const { data, isLoading } = api.post.getAll.useQuery()

  if (isLoading) return <div>Loading...</div>

  if (!data) return <div>Something went wrong...</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex h-screen justify-center'>
        <div className='w-full  border-x border-slate-200 md:max-w-2xl'>
          <div className='flex border-b border-slate-400 p-4'>
            {!user && (
              <div className='flex justify-center'>
                <SignInButton />
              </div>
            )}
            {user && <CreatePostWizard />}
          </div>
          <div>
            {data?.map(fullPost => (
              <PostView key={fullPost.post.id} {...fullPost} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
