import { onRequest } from "firebase-functions/https";
import { createFirebaseAdapter } from "@repo/core";
import { createApp } from "./app";


const app = createApp()
const firebaseAdapter = createFirebaseAdapter(app);
export const api = onRequest({ memory: '256MiB' }, firebaseAdapter);
