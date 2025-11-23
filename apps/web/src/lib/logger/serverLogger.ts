/**
 * Server-side logging configuration using Roarr
 * @module serverLogger
 */
/* eslint-disable */
import { createCloudLoggingSerializer } from "@repo/common";
import { Roarr } from "roarr";

/**
 * Interface defining the available logging methods
 */
interface StructuredLogger {
  debug: (message: string, context?: any) => void;
  info: (message: string, context?: any) => void;
  notice: (message: string, context?: any) => void;
  warning: (message: string, context?: any) => void;
  error: (message: string, context?: any) => void;
  crit: (message: string, context?: any) => void;
  alert: (message: string, context?: any) => void;
  emerg: (message: string, context?: any) => void;
  child: (context: any) => StructuredLogger;
}

// Configure Roarr for server-side logging
if (process.env.NODE_ENV !== "test") {
  process.env.ROARR_LOG = "true";
  const cloudSerializer = createCloudLoggingSerializer();

  // Override stdout to format logs for Google Cloud Logging
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
  const logWithLevel = (level: string) => (message: string, context_data: unknown = {}) => {
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

    logger(logContext, message);
  };

  return {
    debug: logWithLevel("debug"),
    info: logWithLevel("info"),
    notice: logWithLevel("notice"),
    warning: logWithLevel("warning"),
    error: logWithLevel("error"),
    crit: logWithLevel("crit"),
    alert: logWithLevel("alert"),
    emerg: logWithLevel("emerg"),
    child: (context: any) => createStructuredLogger(logger.child(context)),
  };
};

/**
 * Server-side logger that implements RFC 5424 syslog severity levels.
 * Each method includes structured metadata support.
 * @namespace
 * @see {@link https://tools.ietf.org/html/rfc5424#section-6.2.1}
 */
export const serverLogger = {
  /**
   * Log detailed debugging information (severity: 7)
   */
  debug: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).debug(message, meta);
  },

  /**
   * Log normal operational information (severity: 6)
   */
  info: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).info(message, meta);
  },

  /**
   * Log normal but significant events (severity: 5)
   */
  notice: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).notice(message, meta);
  },

  /**
   * Log warning conditions (severity: 4)
   */
  warning: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).warning(message, meta);
  },

  /**
   * Log error conditions (severity: 3)
   */
  error: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).error(message, meta);
  },

  /**
   * Log critical conditions (severity: 2)
   */
  crit: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).crit(message, meta);
  },

  /**
   * Log immediate action required (severity: 1)
   */
  alert: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).alert(message, meta);
  },

  /**
   * Log system is unusable (severity: 0)
   */
  emerg: (message: string, meta?: Record<string, any>) => {
    createStructuredLogger(baseLogger).emerg(message, meta);
  },
} as const;
