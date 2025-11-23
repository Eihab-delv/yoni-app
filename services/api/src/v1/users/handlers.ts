import { glog, refs } from '@repo/core';
import type { CreateUserRouteType, GetUsersRouteType, UpdateUserRoleRouteType, UpdateUserRouteType } from './routes';
import type { InferRouteContext } from '../../context';
import { DEFAULT_IMAGE, UserSchema, type User } from '@repo/common';
import { getDocuments, setDocument } from '@typed-firestore/server';

export const getUsersHandler = async (c: InferRouteContext<GetUsersRouteType>) => {
  const userDocs = await getDocuments(refs.users)
  if (!userDocs || userDocs.length === 0) {
    return c.body(null, 204);
  }
  const users = userDocs.map(u => u.data)
  return c.json(users, 200);
};

export const createUserHandler = async (c: InferRouteContext<CreateUserRouteType>) => {
  const body = c.req.valid('json')
  const user = UserSchema.safeParse({
    ...body,
    id: body.id,
    role: 'member',
    phoneNumber: '',
    locale: 'en-AU',
    status: 'active',
    homeCountry: 'au',
    profileImage: DEFAULT_IMAGE,
    lastLogin: Date.now(),
    marketingOptIn: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as User)
  if (user.error) {
    console.log(user.error)
    return c.json(user.error.flatten(), 401)
  }
  console.log(user)
  await setDocument(refs.users, user.data.id, user.data)
  return c.json(user, 200);
};


export const updateUserHandler = async (c: InferRouteContext<UpdateUserRouteType>) => {
  return c.json({
    id: '',
    name: '',
  }, 200);
};

export const updateUserRoleHandler = async (c: InferRouteContext<UpdateUserRoleRouteType>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { user_id } = c.req.valid('param');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { role } = c.req.valid('json');
  glog.info("Update user role route called with", { user_id, role })

  return c.json({
    id: '',
    name: '',
  }, 200);
};
