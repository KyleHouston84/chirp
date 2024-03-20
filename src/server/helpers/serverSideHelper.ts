import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import superjson from 'superjson';

export const generateServerSideHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson,
  });
