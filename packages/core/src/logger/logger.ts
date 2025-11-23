/* eslint-disable */
import { createCloudLoggingSerializer } from "@repo/common";
import { Roarr } from "roarr";

/**
 * Available log levels for structured logging
 */
export type LogLevel = 'debug' | 'info' | 'notice' | 'warning' | 'warn' | 'error' | 'crit' | 'alert' | 'emerg';

/**
 * Interface defining the available logging methods and their documentation
 */
export interface StructuredLogger {
  /**
   * Log detailed information useful during development and debugging.
   * Examples: Variable states, API request/response bodies, SQL queries.
   */
  debug: (message: string, context?: any) => void;

  /**
   * Log general operational information about system behavior.
   * Examples: User actions, successful API calls, routine operations.
   */
  info: (message: string, context?: any) => void;

  /**
   * Log normal but significant events that require special attention.
   * Examples: System startup/shutdown, configuration changes, user registration.
   */
  notice: (message: string, context?: any) => void;

  /**
   * Log potentially harmful situations that don't prevent normal operation.
   * Examples: Deprecated feature usage, retry attempts, slow response times.
   */
  warning: (message: string, context?: any) => void;

  /**
   * Alias for warning
   */
  warn: (message: string, context?: any) => void;

  /**
   * Log error events that might still allow the application to continue running.
   * Examples: Failed API calls, database errors, caught exceptions.
   */
  error: (message: string, context?: any) => void;

  /**
   * Log critical conditions that require immediate attention.
   * Examples: Application component unavailable, unexpected exceptions.
   */
  crit: (message: string, context?: any) => void;

  /**
   * Log situations that must be corrected immediately.
   * Examples: Database unavailable, entire system component down.
   */
  alert: (message: string, context?: any) => void;

  /**
   * Log system is unusable conditions, panic situations.
   * Examples: Complete system failure, data corruption, unrecoverable errors.
   */
  emerg: (message: string, context?: any) => void;

  /**
   * Create a child logger with additional context
   */
  child: (context: any) => StructuredLogger;
}

// Configure Roarr serializer for Google Cloud Logging
if (process.env.NODE_ENV !== "test") {
  // Set up Google Cloud Logging serializer
  process.env.ROARR_LOG = "true";
  const cloudSerializer = createCloudLoggingSerializer();

  // Override the default serializer
  const originalWrite = process.stdout.write;
  process.stdout.write = function (chunk: any, ...args: any[]) {
    if (typeof chunk === "string" && chunk.includes('"context":{')) {
      try {
        const logEntry = JSON.parse(chunk);
        if (logEntry.context) {
          const formatted = cloudSerializer(logEntry);
          return originalWrite.call(this, formatted + "\n", ...args);
        }
      } catch (e) {
        // If parsing fails, use original chunk
      }
    }
    return originalWrite.call(this, chunk, ...args);
  };
} else {
  // In test environment, disable logging
  process.env.ROARR_LOG = "false";
}

// Create base logger
const baseLogger = Roarr;

/**
 * Creates a structured logger wrapper around Roarr
 */
const createStructuredLogger = (logger: typeof Roarr): StructuredLogger => {
  const logWithLevel = (level: string) => (message: string, context_data: unknown) => {
    let ctx = {};
    if (context_data instanceof Error) {
      ctx = {
        stack: context_data.stack,
        name: context_data.name,
        cause: context_data.cause,
        message: context_data.message,
      };
    } else if (typeof context_data === "object" && context_data !== null) {
      ctx = context_data;
    }

    const logContext = {
      ...ctx,
      logLevel: level,
    };

    // Handle multiple arguments by stringifying objects
    let finalMessage = message;
    if (typeof ctx === "object" && ctx !== null) {
      const contextEntries = Object.entries(ctx).filter(
        ([key]) => key !== "logLevel"
      );
      if (contextEntries.length > 0) {
        const contextStrings = contextEntries.map(([key, value]) =>
          typeof value === "object"
            ? `${key}: ${JSON.stringify(value)}`
            : `${key}: ${value}`
        );
        finalMessage = `${message} ${contextStrings.join(", ")}`;
      }
    }

    logger(logContext, finalMessage);
  };

  return {
    debug: logWithLevel("debug"),
    info: logWithLevel("info"),
    notice: logWithLevel("notice"),
    warning: logWithLevel("warn"),
    warn: logWithLevel("warn"),
    error: logWithLevel("error"),
    crit: logWithLevel("crit"),
    alert: logWithLevel("alert"),
    emerg: logWithLevel("emerg"),
    child: (context: any) => createStructuredLogger(logger.child(context)),
  };
};

/**
 * A logging function that applies Google's structured log formatting
 * to create logs in Google Console that match the respective level.
 *
 * Log Levels Usage Guide:
 * @property {Function} debug - For detailed information useful during development and debugging.
 *                             Examples: Variable states, API request/response bodies, SQL queries.
 *
 * @property {Function} info - For general operational information about system behavior.
 *                            Examples: User actions, successful API calls, routine operations.
 *
 * @property {Function} notice - For normal but significant events that require special attention.
 *                              Examples: System startup/shutdown, configuration changes, user registration.
 *
 * @property {Function} warning - For potentially harmful situations that don't prevent normal operation.
 *                               Examples: Deprecated feature usage, retry attempts, slow response times.
 *
 * @property {Function} error - For error events that might still allow the application to continue running.
 *                             Examples: Failed API calls, database errors, caught exceptions.
 *
 * @property {Function} crit - For critical conditions that require immediate attention.
 *                            Examples: Application component unavailable, unexpected exceptions.
 *
 * @property {Function} alert - For situations that must be corrected immediately.
 *                             Examples: Database unavailable, entire system component down.
 *
 * @property {Function} emerg - For system is unusable conditions, panic situations.
 *                             Examples: Complete system failure, data corruption, unrecoverable errors.
 *
 * @example
 * glog.debug("API Response Body:", { responseData })
 * glog.info("User successfully logged in:", { userId })
 * glog.notice("System configuration updated")
 * glog.warning("API call retry attempt 2 of 3")
 * glog.error("Database query failed:", { error })
 * glog.crit("Authentication service unavailable")
 * glog.alert("Primary database connection lost")
 * glog.emerg("System storage corruption detected")
 */
export const glog: StructuredLogger = createStructuredLogger(baseLogger);

export function logMemoryUsage(stage: string) {
  const memoryUsage = process.memoryUsage();
  glog.debug(`[Memory Usage][${stage}]`, {
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
  });
}
