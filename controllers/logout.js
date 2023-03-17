const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const SessionToken = require('../models/session_token')

router.delete('/', async (req, res) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const authorizationTrimmed = authorization.substring(7)
    const decodedToken = jwt.verify(authorizationTrimmed, SECRET)
    await SessionToken.destroy({ where: { userId: decodedToken.id } })

    res.status(204).end()
  }
})

module.exports = router