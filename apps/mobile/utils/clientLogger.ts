import { Platform } from "react-native";
import { consoleTransport, logger, transportFunctionType } from "react-native-logs";
import { modelName } from "expo-device";
import * as Application from "expo-application";
import { env } from "@/lib/env";

/**
 * Sequential log processing queue to maintain order of log delivery
 * Ensures logs are transported to the server in the exact order they were created
 */
class LogQueue {
  private readonly pendingLogs: Array<() => Promise<void>> = [];
  private isCurrentlyProcessing = false;

  /**
   * Adds a log function to the queue and starts processing if not already running
   * @param logFunction - Async function that sends the log to the server
   * @returns {Promise<void>}
   */
  async enqueue(logFunction: () => Promise<void>): Promise<void> {
    this.pendingLogs.push(logFunction);
    
    if (!this.isCurrentlyProcessing) {
      await this.startProcessing();
    }
  }

  /**
   * Processes all pending logs sequentially to maintain order
   * Continues until the queue is empty
   * @returns {Promise<void>}
   */
  private async startProcessing(): Promise<void> {
    this.isCurrentlyProcessing = true;
    
    while (this.hasLogs()) {
      const nextLog = this.getNextLog();
      
      if (nextLog) {
        await this.executeLogSafely(nextLog);
      }
    }
    
    this.isCurrentlyProcessing = false;
  }

  /**
   * Checks if there are any logs waiting to be processed
   * @returns {boolean} - True if there are logs in the queue, false otherwise
   */
  private hasLogs(): boolean {
    return this.pendingLogs.length > 0;
  }

  /**
   * Retrieves and removes the next log from the queue (FIFO)
   * @return {(() => Promise<void>) | undefined} - The next log function or undefined if the queue is empty
   */
  private getNextLog(): (() => Promise<void>) | undefined {
    return this.pendingLogs.shift();
  }

  /**
   * Executes a log function with error handling to prevent queue blockage
   * @param {() => Promise<void>} logFunction - The log function to execute
   * @returns {Promise<void>}
   */
  private async executeLogSafely(logFunction: () => Promise<void>): Promise<void> {
    try {
      await logFunction();
    } catch (error) {
      console.warn('Failed to process log entry:', error);
    }
  }
}

const logQueue = new LogQueue();

const customTransport: transportFunctionType<{ endpoint: string }> = async (props) => {
  // Enqueue the log to maintain order
  await logQueue.enqueue(async () => {
    try {
      if (!props.options?.endpoint) {
        throw new Error("Endpoint is required for custom transport");
      }

      const logPayload = {
        level: props.level.text,
        message: props.msg,
        platform: Platform.OS,
        device: modelName || 'Unknown Device',
        appVersion: Application.nativeApplicationVersion || 'Unknown Version',
      }

      await fetch(props.options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logPayload),
      })
    } catch (err) {
      console.warn('Expo Log Transport Failed', err)
    }
  });
}

/**
 * Client-side logger interface
 * Follows syslog severity levels from RFC 5424.
 * @namespace
 * @see {@link https://tools.ietf.org/html/rfc5424#section-6.2.1}
 */
export interface Logger {
  /**
   * Log detailed debugging information (severity: 7)
   */
  debug: (...args: any[]) => void;
  /**
   * Log normal operational information (severity: 6)
   */
  info: (...args: any[]) => void;
  /**
   * Log normal but significant events (severity: 5)
   */
  notice: (...args: any[]) => void;
  /**
   * Log warning conditions (severity: 4)
   */
  warning: (...args: any[]) => void;
  /**
   * Log error conditions (severity: 3)
   */
  error: (...args: any[]) => void;
  /**
   * Log critical conditions (severity: 2)
   */
  crit: (...args: any[]) => void;
  /**
   * Log immediate action required (severity: 1)
   */
  alert: (...args: any[]) => void;
  /**
   * Log system is unusable (severity: 0)
   */
  emerg: (...args: any[]) => void;
}

const LOGGER_CONFIG = {
  SERVER_IDENTIFIER: env.EXPO_PUBLIC_SERVER_IDENTIFIER
}

// Ensure log levels are in sync with the Logger interface
const LOG_LEVELS = {
  debug: 7,
  info: 6,
  notice: 5,
  warning: 4,
  error: 3,
  crit: 2,
  alert: 1,
  emerg: 0
} as const satisfies Record<keyof Logger, number>;

export const log = logger.createLogger({
  levels: LOG_LEVELS,
  async: false, // Ensure synchronous queueing
  printLevel: false,
  printDate: false,
  severity: 'emerg', // Severity level set to 'emerg' to capture all logs
  transport: __DEV__ ? consoleTransport : customTransport,
  transportOptions: {
    endpoint: `https://expo-logs-${LOGGER_CONFIG.SERVER_IDENTIFIER}-uc.a.run.app`
  }
}) as Logger;