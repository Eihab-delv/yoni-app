import { nanoid } from "zod/v4";
import { UserSchema, type User } from "~/schemas";
import { DEFAULT_IMAGE } from "~/utils";

export function buildUser(userPartial: Partial<User>): User {
  return UserSchema.parse({
    id: nanoid(),
    firstName: '',
    lastName: '',
    email: '',
    role: 'member',
    phoneNumber: '',
    locale: 'en-AU',
    status: 'active',
    homeCountry: 'au',
    profileImage: DEFAULT_IMAGE,
    lastLogin: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...userPartial,
  } as User)
}


