const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../models/blog')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    order: [['likes', 'DESC']],
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('count', sequelize.col('author')), 'blogs'],
      [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
    ],
  })
  res.json(authors)
})

module.exports = router