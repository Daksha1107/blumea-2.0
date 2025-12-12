import { randomUUID } from 'crypto';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  requestId?: string;
  userId?: string;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private formatLog(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const requestId = this.context.requestId || randomUUID();

    const logEntry = {
      timestamp,
      level,
      message,
      requestId,
      ...this.context,
      ...(data && { data }),
    };

    return JSON.stringify(logEntry);
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatLog('debug', message, data));
    }
  }

  info(message: string, data?: any) {
    console.info(this.formatLog('info', message, data));
  }

  warn(message: string, data?: any) {
    console.warn(this.formatLog('warn', message, data));
  }

  error(message: string, error?: Error | any, data?: any) {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;

    console.error(this.formatLog('error', message, { ...data, error: errorData }));
  }
}

export const logger = new Logger();

export function withRequestId<T>(fn: () => T): T {
  const requestId = randomUUID();
  logger.setContext({ requestId });
  
  try {
    return fn();
  } finally {
    logger.clearContext();
  }
}

export async function withRequestIdAsync<T>(fn: () => Promise<T>): Promise<T> {
  const requestId = randomUUID();
  logger.setContext({ requestId });
  
  try {
    return await fn();
  } finally {
    logger.clearContext();
  }
}
