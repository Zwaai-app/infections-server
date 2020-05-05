import winston from 'winston'

let consoleLevel: string
if (process.env.NODE_ENV === 'production') {
  consoleLevel = 'error'
} else if (process.env.NODE_ENV === 'test') {
  consoleLevel = 'error'
} else {
  consoleLevel = 'debug'
}

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({ level: consoleLevel }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' })
  ]
}

const logger = winston.createLogger(options)

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level')
}

export default logger
