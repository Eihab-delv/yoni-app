import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFunctions } from "firebase-admin/functions";
import { getStorage } from "firebase-admin/storage";
import { getOrThrow } from "get-or-throw";

export type { DecodedIdToken } from "firebase-admin/auth";
export { FieldValue, Timestamp } from "firebase-admin/firestore";
export type { Firestore, UpdateData } from "firebase-admin/firestore";

if (!admin.apps.length && 'initializeApp' in admin && typeof admin.initializeApp === 'function') {
  admin.initializeApp();

  // @ts-expect-error TODO: FIXME
  const db = getFirestore(getApp());

  db.settings({
    ignoreUndefinedProperties: true,
  });
}

function getApp() {
  return getOrThrow(admin.apps, 0);
}

const firebaseApp = getApp();

// @ts-expect-error TODO: FIXME
export const auth = getAuth(firebaseApp);
// @ts-expect-error TODO: FIXME
export const db = getFirestore(firebaseApp);
// @ts-expect-error TODO: FIXME
export const storage = getStorage(firebaseApp);
// @ts-expect-error TODO: FIXME
export const functions = getFunctions(firebaseApp);
