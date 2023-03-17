const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { Blog } = require('../models')
const { User } = require('../models')

const { Op } = require('sequelize')
const { sequelize } = require('../models/blog')


router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    const queryLowercased = req.query.search.toLowerCase()

    where = { [Op.or]: [
      sequelize.where(sequelize.fn('lower', sequelize.col('title')), { [Op.like]: `%${queryLowercased}%` }),
      sequelize.where(sequelize.fn('lower', sequelize.col('author')), { [Op.like]: `%${queryLowercased}%` })
    ] }
  }
  const blogs = await Blog.findAll({
    include: {
      model: User
    },
    order: [
      ['likes', 'DESC']
    ],
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const decodedToken = req.decodedToken
  const blog = await Blog.create({ ...req.body, userId: decodedToken.id })
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

router.delete('/:id', tokenExtractor, async (req, res) => {
  const verifiedToken = req.decodedToken

  const blog = await Blog.findByPk(req.params.id)
  if (blog && blog.userId === verifiedToken.id) {
    await blog.destroy()
    res.status(204).end()
  } else {
    throw Error('unauthorized')
  }
})

module.exports = router