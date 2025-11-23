"use client";

import { Roarr } from "roarr";

const API_LOG_ENDPOINT = "/api/log";

// Configure Roarr for client-side logging
if (typeof window !== "undefined") {
  process.env.ROARR_LOG = "true";
}

const baseLogger = Roarr;

/**
 * Sends log data to the Next.js server API
 */
async function sendLogToServer(
  level: string,
  message: string,
  meta?: Record<string, unknown>
): Promise<void> {
  try {
    await fetch(API_LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, message, meta }),
    });
  } catch (error) {
    console.error("Failed to send log to server", error);
  }
}

/**
 * Creates a log function that logs locally, to the browser console, and to the server
 */
const createLogFunction =
  (level: string) =>
    (message: string, meta?: Record<string, unknown>): void => {
      // Log locally using Roarr
      const context = {
        logLevel: level,
        ...(meta && { ...meta }),
      };

      baseLogger(context, message);

      // Log to the browser console
      const timestamp = new Date().toISOString();
      console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`, meta || {});

      // Send to server
      void sendLogToServer(level, message, meta);
    };

/**
 * Client-side logger that sends logs to the browser console, Roarr, and the server API.
 * Follows syslog severity levels from RFC 5424.
 * @namespace
 * @see {@link https://tools.ietf.org/html/rfc5424#section-6.2.1}
 */
export const clientLogger = {
  /**
   * Log detailed debugging information (severity: 7)
   */
  debug: createLogFunction("debug"),

  /**
   * Log normal operational information (severity: 6)
   */
  info: createLogFunction("info"),

  /**
   * Log normal but significant events (severity: 5)
   */
  notice: createLogFunction("notice"),

  /**
   * Log warning conditions (severity: 4)
   */
  warning: createLogFunction("warning"),

  /**
   * Log error conditions (severity: 3)
   */
  error: createLogFunction("error"),

  /**
   * Log critical conditions (severity: 2)
   */
  crit: createLogFunction("crit"),

  /**
   * Log immediate action required (severity: 1)
   */
  alert: createLogFunction("alert"),

  /**
   * Log system is unusable (severity: 0)
   */
  emerg: createLogFunction("emerg"),
} as const;
