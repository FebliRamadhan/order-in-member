import path from 'path';
import winston from 'winston';

const {
  json,
  align, 
  label,
  printf,
  combine,
  metadata,
  timestamp,
  prettyPrint
} = winston.format;

const options = {
  file: {
    level: 'info',
    filename: `${path.join(path.resolve('./'), 'logs')}/combine.log`,
    format: combine(
      label({ label: path.basename(process.mainModule.filename)}),
      timestamp(),
      align(),
      prettyPrint(),
      printf(
        info => `${info.timestamp} ${info.level} [${info.label}] ${info.message} ${info.metadata}`
      )
    ),
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    handleExceptions: true
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: `${path.join(path.resolve('./'), 'logs')}/error.log`,
    json: true,
    colorize: true,
    maxsize: 5242880,
    maxFiles: 5,
    handleExceptions: true
  },
  console: {
    level: 'info',
    format: combine(
      label({ label: path.basename(process.mainModule.filename)}),
      timestamp(),
      align(),
      prettyPrint(),
      printf(
        info => `${info.timestamp} ${info.level} [${info.label}] ${info.message} ${info.metadata}`
      )
    ),
    maxsize: 5420880,
    maxFiles: 5,
    colorize: false,
    handleExceptions: true
  }
}

const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

logger.stream = {
  write: (message, encoding) =>  {
    logger.log('info', message)
  }
}

module.exports = logger;