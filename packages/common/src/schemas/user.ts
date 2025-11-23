import { z } from 'zod';

export const RoleSchema = z.enum(['guest', 'member', 'admin', 'organizationAdmin']);
export const MemberStatusSchema = z.enum(['active', 'inactive', 'suspended']);

export const UserSchema = z.object({
  id: z.string(),
  role: RoleSchema,
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  email: z.string().email(),
  locale: z.string(),
  status: MemberStatusSchema.optional(),
  homeCountry: z.string(),
  profileImage: z.string().url(),
  lastLogin: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type Role = z.infer<typeof RoleSchema>
