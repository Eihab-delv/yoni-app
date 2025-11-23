import type { FirestoreDataConverter, DocumentData } from "firebase-admin/firestore";
import type { z, ZodTypeAny } from "zod";

export function zodAdminConverter<S extends ZodTypeAny, T = z.infer<S>>(
  schema: S
): FirestoreDataConverter<T> {
  return {
    toFirestore(document: T): DocumentData {
      return schema.parse(document) as DocumentData;
    },
    fromFirestore(snapshot) {
      const data = snapshot.data();
      return schema.parse(data);
    },
  };
}
