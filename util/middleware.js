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
    
    next(error)
  }

  module.exports = {
    errorHandler
  }