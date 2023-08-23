import { Logger, createLogger, format, transports } from 'winston';
import { join } from 'path';

const { printf, colorize } = format;
const colorizer = colorize();

const timestampFormatter = () => new Date().toISOString();

const consoleFormatter = printf(({ stack, level, message, label, timestamp }: { [key: string]: string }) => {
  const levelLabelColorized = colorizer.colorize(level, `${level}:${label}`);
  const timestampColorized = `\u{1b}[90;1m${new Date(timestamp).toLocaleTimeString('pt-BR', { hour12: false })}\u{1b}[0m`;
  return `${timestampColorized} ${levelLabelColorized}: ${stack ? stack : message}`;
});

const configureLogger = (label = 'main', level = 'info') =>
  createLogger({
    level,
    defaultMeta: { label },
    format: format.combine(format.errors({ stack: true }), format.timestamp({ format: timestampFormatter })),
  })
    .add(
      new transports.Console({
        format: consoleFormatter,
      }),
    )
    .add(
      new transports.File({
        format: consoleFormatter,
        filename: join(__dirname, '..', '..', 'log.log'),
      }),
    );

const baseLogger = configureLogger();

/**
 * Returns a pretty represetation of a json for a give object
 *
 * @param obj An object
 */
export const JsonStringify = (obj: any) => `\n${JSON.stringify(obj, null, 2)}\n`;
export const Stringify = (obj: any) => `${JSON.stringify(obj)}`;

export const ConfigureCmds = (logLevel?: 'verbose' | 'debug' | 'info') => {
  logger.level = logLevel;
};

export const logger = baseLogger;

export const labeledLogger = (label: string) => (type: 'info' | 'warn' | 'error' | 'debug' | 'verbose', str: any) => logger[type](str as string, { label });

export type LabeledLoggerFn = (type: 'info' | 'warn' | 'error' | 'debug' | 'verbose', str: any) => Logger;
