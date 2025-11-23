/* eslint-disable */
import jsonStringify from "safe-stable-stringify";

export interface StackdriverData {
  serviceContext?: any;
  message?: string;
  metadata?: any;
}

// Extended map of Roarr logging levels to Stackdriver
const ROARR_TO_STACKDRIVER: Map<string, string> = new Map([
  ["trace", "DEBUG"],
  ["debug", "DEBUG"],
  ["info", "INFO"],
  ["warn", "WARNING"],
  ["error", "ERROR"],
  ["fatal", "CRITICAL"],
  // Additional levels for compatibility
  ["notice", "NOTICE"],
  ["alert", "ALERT"],
  ["emerg", "EMERGENCY"],
  ["crit", "CRITICAL"],
]);

export const LOGGING_TRACE_KEY = "logging.googleapis.com/trace";

interface EntryMetadata {
  resource?: any;
  severity: string;
  logName?: string;
  httpRequest?: any;
  timestamp?: Date;
  labels?: any;
  trace?: string;
}

/**
 * Formats the message with stack trace if available
 */
const formatMessage = (message: string, stack?: string): string => {
  if (!stack) return message || "";
  return `${message}${message ? " " : ""}${stack}`;
};

/**
 * Creates the base metadata entry with severity
 */
const createBaseMetadata = (resource: any, level: string): EntryMetadata => ({
  resource,
  severity: ROARR_TO_STACKDRIVER.get(level) || "DEFAULT",
});

/**
 * Enhances metadata with optional properties if they exist
 */
const enhanceMetadata = (
  baseMetadata: EntryMetadata,
  metadata: any
): EntryMetadata => {
  const enhanced = { ...baseMetadata };

  if (metadata.logName) enhanced.logName = metadata.logName;
  if (metadata.httpRequest) enhanced.httpRequest = metadata.httpRequest;
  if (metadata.timestamp instanceof Date) enhanced.timestamp = metadata.timestamp;
  if (metadata.labels) enhanced.labels = metadata.labels;

  const trace = metadata[LOGGING_TRACE_KEY];
  if (trace) enhanced.trace = trace as string;

  return enhanced;
};

/**
 * Custom serializer for Google Cloud Logging format
 */
export const createCloudLoggingSerializer = (resource?: any) => {
  return (logEntry: any) => {
    const { context = {}, message, ...other } = logEntry;
    const level = context.logLevel || "info";
    const metadata = context.metadata || {};

    const data: StackdriverData = {
      message: formatMessage(message, metadata.stack),
    };

    const entryMetadata = enhanceMetadata(
      createBaseMetadata(resource, level),
      metadata
    );

    return jsonStringify({ ...data, ...entryMetadata, ...other });
  };
};
