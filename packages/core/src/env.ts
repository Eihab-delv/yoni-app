import { z } from "zod";
import { glog } from "./logger";

/**
 * Server identifiers for different environments
 */
export const ServerIdentifier = {
  Development: 'TODO: get dev env id',
  Staging: 'TODO: get staging env id',
  Production: 'TODO: get prod env id',
} as const;

export type ServerIdentifier = typeof ServerIdentifier[keyof typeof ServerIdentifier];

/**
 * Helper functions to create common validation patterns
 */
const createValidators = {
  requiredInDevStaging: (name: string) =>
    z.string().min(1).optional()
      .refine((val) => process.env.SERVER_IDENTIFIER === ServerIdentifier.Production || val, {
        message: `${name} is required in staging and development`
      }),
  requiredInDev: (name: string) =>
    z.string().min(1).optional()
      .refine((val) => process.env.SERVER_IDENTIFIER !== ServerIdentifier.Development || val, {
        message: `${name} is required in Dev`
      }),
  requiredInProd: (name: string) =>
    z.string().min(1).optional()
      .refine((val) => process.env.SERVER_IDENTIFIER !== ServerIdentifier.Production || val, {
        message: `${name} is required in production`
      }),
  requiredInProdStaging: (name: string) =>
    z.string().min(1).optional()
      .refine((val) => process.env.SERVER_IDENTIFIER === ServerIdentifier.Development || val, {
        message: `${name} is required in staging and production`
      }),
  required: () => z.string().min(1),
  requiredUrl: () => z.string().url()
};

/**
 * Schema for validating environment variables
 */
const envSchema = z.object({
  SERVER_IDENTIFIER: z.enum([
    ServerIdentifier.Development,
    ServerIdentifier.Staging,
    ServerIdentifier.Production
  ]),
  ROARR_LOG: createValidators.required(),
  API_KEY: createValidators.required(),
});

/**
 * Type definition for the validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env | undefined;

/**
 * Gets the validated environment variables
 * @throws {Error} If environment variables are missing or do not match the schema for the current environment
 * @returns {Env} The validated environment variables
 */
export const getEnv = (): Env => {
  try {
    parsedEnv ??= envSchema.parse(process.env)
    return parsedEnv
  } catch (error) {
    glog.crit("ENV schema validation failed:", error)
    throw error
  }
}

/**
 * Helper function to check if we're in production
 * @returns {boolean} True if running in production environment
 */
export const isProduction = (): boolean => getEnv().SERVER_IDENTIFIER === ServerIdentifier.Production;

/**
 * Helper function to check if we're in staging
 * @returns {boolean} True if running in staging environment
 */
export const isStaging = (): boolean => getEnv().SERVER_IDENTIFIER === ServerIdentifier.Staging;

/**
 * Helper function to check if we're in development
 * @returns {boolean} True if running in development environment
 */
export const isDevelopment = (): boolean => getEnv().SERVER_IDENTIFIER === ServerIdentifier.Development;
