import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
if ('initializeApp' in admin && typeof admin.initializeApp === 'function') {
  admin.initializeApp();
}

// Types and Interfaces
type AllowedEmail = {
  email: string;
  added: admin.firestore.Timestamp;
  addedBy: string;
  notes?: string;
}

type AccessCheckResponse = {
  hasAccess: boolean;
  message?: string;
}

type AddEmailRequest = {
  email: string;
  notes?: string;
}

type AddEmailResponse = {
  success: boolean;
  message?: string;
}

// Constants
const ALLOWED_DOMAINS: string[] = [
  "thenod.app",
  "delv.com"
];

const ALLOWED_EMAILS: string[] = [];

// Helper Functions
const isEmailAllowed = async (email: string): Promise<boolean> => {
  // Check hardcoded specific emails
  if (ALLOWED_EMAILS.includes(email)) return true;

  // Check hardcoded domains
  const isDomainAllowed = ALLOWED_DOMAINS.some((domain) =>
    email.toLowerCase().endsWith(`@${domain.toLowerCase()}`),
  );
  if (isDomainAllowed) return true;

  // Check Firestore for dynamically added emails
  try {
    const doc = await admin
      .firestore()
      .collection("allowedEmails")
      .doc(email.toLowerCase())
      .get();

    return doc.exists;
  } catch (error) {
    console.error("Error checking Firestore for allowed email:", error);
    return false;
  }
};

// Cloud Functions
export const checkUserAccess = functions.https.onCall(
  async (
    data: unknown,
    context: functions.https.CallableContext,
  ): Promise<AccessCheckResponse> => {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
      );
    }

    const email = context.auth.token.email;
    if (!email) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "User must have an email address",
      );
    }

    // Check if user's email is allowed
    const hasAccess = await isEmailAllowed(email);

    if (hasAccess) {
      // Set custom claim for faster future checks
      try {
        await admin
          .auth()
          .setCustomUserClaims(
            context.auth.uid, {
            hasAccess: true
          }
          );
      } catch (error) {
        console.error("Error setting custom claims:", error);
        // Don't fail the request if setting claims fails
      }
    }

    return {
      hasAccess,
      message: hasAccess ? "Access granted" : "Access denied",
    };
  },
);

export const addAllowedEmail = functions.https.onCall(
  async (
    data: AddEmailRequest,
    context: functions.https.CallableContext,
  ): Promise<AddEmailResponse> => {
    // Check if caller is an admin
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Must be an admin to add emails",
      );
    }

    const { email, notes } = data;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid email address",
      );
    }

    try {
      // Add to Firestore
      const emailDoc: AllowedEmail = {
        email: email.toLowerCase(),
        added: admin.firestore.Timestamp.now(),
        addedBy: context.auth.uid,
        notes: notes,
      };

      await admin
        .firestore()
        .collection("allowedEmails")
        .doc(email.toLowerCase())
        .set(emailDoc);

      return {
        success: true,
        message: `Successfully added ${email} to allowed list`,
      };
    } catch (error) {
      console.error("Error adding allowed email:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to add email to allowed list",
      );
    }
  },
);

export const removeAllowedEmail = functions.https.onCall(
  async (
    data: { email: string },
    context: functions.https.CallableContext,
  ): Promise<AddEmailResponse> => {
    // Check if caller is an admin
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Must be an admin to remove emails",
      );
    }

    const { email } = data;

    try {
      await admin
        .firestore()
        .collection("allowedEmails")
        .doc(email.toLowerCase())
        .delete();

      // Optionally revoke access by removing custom claims
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { hasAccess: false });

      return {
        success: true,
        message: `Successfully removed ${email} from allowed list`,
      };
    } catch (error) {
      console.error("Error removing allowed email:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to remove email from allowed list",
      );
    }
  },
);

