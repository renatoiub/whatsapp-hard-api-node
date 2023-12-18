const dotenv = require('dotenv')
//const mongoose = require('mongoose')
const logger = require('pino')()
dotenv.config()

const app = require('./config/express')
const config = require('./config/config')

const { Session } = require('./api/class/session')


let server


server = app.listen(config.port, async () => {
    logger.info(`Listening on port ${config.port}`)
   
    if (config.restoreSessionsOnStartup) {
        logger.info(`Restaurando sessions`)
        const session = new Session()
        let restoreSessions = await session.restoreSessions()
        logger.info(`Sessions restauradas`)
    }
})

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed')
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    if (server) {
        server.close()
    }
})

module.exports = server
