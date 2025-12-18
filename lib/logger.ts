/**
 * Structured Logger
 * Provides consistent logging across the application with log levels and formatting
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment || this.isProduction) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
        },
      }),
    };
    console.error(this.formatMessage('error', message, errorContext));
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Log API request
   */
  request(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, context);
  }

  /**
   * Log API response
   */
  response(method: string, path: string, status: number, duration?: number): void {
    const context = duration ? { duration: `${duration}ms` } : undefined;
    this.info(`${method} ${path} - ${status}`, context);
  }

  /**
   * Log database query (only in development)
   */
  query(operation: string, model: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.debug(`DB: ${operation} ${model}`, context);
    }
  }

  /**
   * Log payment event
   */
  payment(event: string, orderId: string, context?: LogContext): void {
    this.info(`Payment: ${event}`, { orderId, ...context });
  }

  /**
   * Log email event
   */
  email(event: string, recipient: string, context?: LogContext): void {
    this.info(`Email: ${event}`, { recipient, ...context });
  }

  /**
   * Log authentication event
   */
  auth(event: string, userId?: string, context?: LogContext): void {
    this.info(`Auth: ${event}`, { userId, ...context });
  }
}

// Export singleton instance
export const logger = new Logger();
