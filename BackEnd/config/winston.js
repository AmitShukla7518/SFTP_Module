var winston = require('winston');
const MESSAGE = Symbol.for('message');
require('custom-env').env(true)
require('winston-daily-rotate-file');
const moment = require('moment-timezone');

const jsonFormatter = (logEntry) => {
  const base = {
    timestamp: moment().tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
    service: "EMS",
    env: `${process.env.name}`
  };
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
}

var transport = new (winston.transports.DailyRotateFile)({
  filename: `${process.env.logPath}.%DATE%.log`,
  level: 'info',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: 5242880,
  maxFiles: '100d',
  createSymlink: true,
  symlinkName: `${process.env.name}.log`
});

var jsonTransport = new (winston.transports.DailyRotateFile)({
  filename: `${process.env.logJsonPath}.%DATE%.log`,
  level: 'info',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: 5242880,
  maxFiles: '100d',
  createSymlink: true,
  symlinkName: `${process.env.name}.log`
});

//   transports.push( 
//     new winston.transports.File(options.file),
//     new winston.transports.File(options.jsonFile),
//     // new winston.transports.Console(options.console)
//   )
// transport, 

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
  format: winston.format(jsonFormatter)(),
  transports: [jsonTransport, new winston.transports.Console()],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;