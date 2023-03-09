const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog } = require('../models')
const { User } = require('../models')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const verifyToken = (req) => {
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  return decodedToken
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
      include: {
        model: User
      }
    })
    res.json(blogs)
  })
  
router.post('/', async (req, res) => {
  const decodedToken = verifyToken(req)
  const blog = await Blog.create({...req.body, userId: decodedToken.id})
  res.json(blog)
  })

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  } else {
      res.status(404).end()
    }
})
  
router.delete('/:id', async (req, res) => {
  const verifiedToken = verifyToken(req)

  const blog = await Blog.findByPk(req.params.id)
  if (blog && blog.userId === verifiedToken.id) {
    await blog.destroy()
    res.status(204).end()
  } else {
  throw Error("unauthorized");
  }
})

module.exports = router