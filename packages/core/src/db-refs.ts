import { CollectionReference } from "firebase-admin/firestore";
import { db } from "./firebase";
import { type Notification, NotificationSchema, type User, UserSchema } from "@repo/common";
import { zodAdminConverter } from "./converter";

export const refs = {
  users: db.collection("users").withConverter(zodAdminConverter(UserSchema)) as CollectionReference<User>,
  notifications: db.collection("notifications").withConverter(zodAdminConverter(NotificationSchema)) as CollectionReference<Notification>,
} as const;
