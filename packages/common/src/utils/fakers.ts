import { faker } from '@faker-js/faker';
import {
  type Notification,
  type User,
  MemberStatusSchema,
  RoleSchema,
} from '../schemas';

// Generate fake data for Notification
export const generateFakeNotification = (): Notification => ({
  id: faker.string.uuid(),
  notificationId: faker.string.uuid(),
  userId: faker.string.uuid(),
  title: faker.lorem.words(5),
  body: faker.lorem.paragraph(),
  actionLink: faker.internet.url(),
  isRead: faker.datatype.boolean(),
  readAt: faker.date.recent().getTime(),
  createdAt: faker.date.past().getTime(),
  updatedAt: faker.date.recent().getTime(),
});

// Generate fake data for User
export const generateFakeUser = (): User => ({
  id: faker.string.uuid(),
  role: faker.helpers.arrayElement(RoleSchema.options),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  email: faker.internet.email(),
  locale: faker.location.countryCode(),
  status: faker.helpers.arrayElement(MemberStatusSchema.options),
  homeCountry: faker.location.country(),
  profileImage: faker.image.avatar(),
  lastLogin: faker.date.recent().getTime(),
  createdAt: faker.date.past().getTime(),
  updatedAt: faker.date.recent().getTime(),
});