const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const SessionToken = require('../models/session_token')
const User = require('../models/user')


const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'SequelizeDatabaseError') {
    return response.status(500).send({ error: error.message, middleware: ' tämä on error handler' })
  }
  if (error.name === 'SequelizeValidationError') {
    return response.status(500).send({ error: error.message, middleware: ' tämä on error handler error with validation.' })
  }
  if (error.name === 'ReferenceError') {
    return response.status(500).send({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(500).send({ error: error.message, middleware: ' tämä on error handler error with validation.' })
  }
  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const authorizationTrimmed = authorization.substring(7)
      const decodedToken = jwt.verify(authorizationTrimmed, SECRET)

      const sessionTokens = await SessionToken.findAll({ where: { userId: decodedToken.id } })

      if (sessionTokens.length === 0) {
        return res.status(401).json({ error: 'your token has expired, please try to sign in again' })
      }

      const validToken = sessionTokens.find(session => session.token === authorizationTrimmed)

      if (!validToken) {
        return res.status(401).json({ error: 'your token has expired, please try to sign in again' })
      }

      const userInfo = await User.findByPk( decodedToken.id)
      if (userInfo.tokenDisabled) {
        return res.status(401).json({ error: 'account disabled, please contact admin' })
      }

      req.decodedToken = decodedToken

    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  errorHandler, tokenExtractor
}