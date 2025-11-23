// Type definition for our logger interface
/** Metadata type for logging - allows any key-value pairs */
type LogMeta = Record<string, unknown>;

/**
 * Universal logger interface that works in both client and server environments.
 * Follows syslog severity levels from RFC 5424.
 * @interface
 * @see {@link https://tools.ietf.org/html/rfc5424#section-6.2.1}
 */
interface Logger {
  debug: (message: string, meta?: LogMeta) => void;
  info: (message: string, meta?: LogMeta) => void;
  notice: (message: string, meta?: LogMeta) => void;
  warning: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  crit: (message: string, meta?: LogMeta) => void;
  alert: (message: string, meta?: LogMeta) => void;
  emerg: (message: string, meta?: LogMeta) => void;
}

let loggerInstance: Logger;

// Use an async import but expose a synchronous interface
if (typeof window === 'undefined') {
  // Server-side

  import('./serverLogger').then(({ serverLogger }) => {
    loggerInstance = serverLogger;
  });
} else {
  // Client-side

  import('./clientLogger').then(({ clientLogger }) => {
    loggerInstance = clientLogger;
  });
}

// Create a proxy to handle the async initialization
export const logger = new Proxy({} as Logger, {
  get: (_target, prop: string) => {
    return (...args: [string, LogMeta?]) => {

      if (loggerInstance) {
        return (loggerInstance[prop as keyof Logger])(...args);
      } else {
        // Fallback if logger isn't initialized yet
        console[prop as 'log' | 'error' | 'warn' | 'info'](...args);
      }
    };
  }
});
