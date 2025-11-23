import { refs } from "./db-refs";
import { faker } from "@faker-js/faker";
import { db } from "./firebase";
import { UserSchema, type User } from "@repo/common";

/** Seed Firestore with random data */
export async function seedFirestore() {
  await db.runTransaction(async (tx) => {
    const users: User[] = [];

    // Seed Users
    for (let i = 0; i < 10; i++) {
      const user = UserSchema.parse({
        id: faker.string.nanoid(),
        role: faker.helpers.arrayElement([
          "guest",
          "member",
          "admin",
          "organizationAdmin",
        ]),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        locale: faker.location.language().alpha3,
        status: faker.helpers.arrayElement(["active", "inactive", "suspended"]),
        homeCountry: faker.location.country(),
        profileImage: faker.image.avatar(),
        lastLogin: faker.date.recent().getTime(),
        marketingOptIn: faker.datatype.boolean(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as User);
      users.push(user);
      tx.create(refs.users.doc(user.id), user);
    }

    // Seed Notifications
    for (let i = 0; i < 15; i++) {
      const user = faker.helpers.arrayElement(users);

      const notification = {
        id: faker.string.nanoid(),
        notificationId: faker.string.nanoid(),
        userId: user.id,
        title: faker.lorem.words(5),
        body: faker.lorem.paragraph(),
        actionLink: faker.internet.url(),
        isRead: faker.datatype.boolean(),
        readAt: faker.date.recent().getTime(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      tx.create(refs.notifications.doc(notification.id), notification);
    }

  });

  console.log("Firestore seeded successfully!");
}
