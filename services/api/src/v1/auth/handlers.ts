import { refs } from '@repo/core';
import type { InferRouteContext } from '~/context';
import type { SignupRouteType } from './routes';
import { buildUser } from '@repo/common';
import { getDocument, setDocument } from '@typed-firestore/server';

export const getSignupHandler = async (c: InferRouteContext<SignupRouteType>) => {
  const body = c.req.valid('json')
  const newUser = buildUser(body)
  await setDocument(refs.users, newUser.id, newUser)
  const user = await getDocument(refs.users, body.id)
  return c.json(user, 200);
};
