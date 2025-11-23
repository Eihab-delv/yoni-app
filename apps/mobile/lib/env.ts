import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_API_BASE_URL: z.string().url(),
    EXPO_PUBLIC_SERVER_IDENTIFIER: z.string(),
    EXPO_PUBLIC_ENVIRONMENT: z.enum(['dev', 'staging', 'prod']).default('dev')
  },
  runtimeEnv: {
    EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_SERVER_IDENTIFIER: process.env.EXPO_PUBLIC_SERVER_IDENTIFIER
  }
});
