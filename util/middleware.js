const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.log('nimi on ', error.name)

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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
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