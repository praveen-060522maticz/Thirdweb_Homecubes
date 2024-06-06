const fs = require('fs');
const path = require('path')
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require("winston-daily-rotate-file");


const winston = require('winston');


winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
});

// let currentLogFile = `${'logs'}/log-${getCurrentDate()}.log`;

const logsDir = path.join(__dirname,'../public/logs') // '../logs';
console.log('is exist -->',fs.existsSync(logsDir),__dirname,path.join(__dirname,'../public/logs'))
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});



 const err = new winston.transports.DailyRotateFile({
    filename: `./public/logs/error/${'error'}-%DATE%.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "error",
})
const alert =new winston.transports.DailyRotateFile({
      filename: `./public/logs/alerts/${'alerts'}-%DATE%.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "alerts",
})
const info = new winston.transports.DailyRotateFile({
    filename: `./public/logs/info/${'info'}-%DATE%.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "info",
})
const log = new winston.transports.DailyRotateFile({
    filename: `./public/logs/logs/${'log'}-%DATE%.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "log",
})

// Create a logger instance

const logger = createLogger({
    format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        err,
        alert,
        info
    ]
});


module.exports = logger;