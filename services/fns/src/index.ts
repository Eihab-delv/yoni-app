/**
 * This file exports all cloud functions and forms the entry point for Firebase
 * functions deployment, as referenced in package.json > main.
 *
 * Every feature folder only exports its functions at the top level.
 *
 * Logger compat is required to have console methods connected to Google cloud
 * logging.
 */
import "firebase-functions/logger/compat";
import admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

export * from "./wiki"
export * from "./expo-logs"