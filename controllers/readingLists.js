const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { ReadingLists } = require('../models')
const { sequelize } = require('../models/reading_lists')

router.post('/', async (req, res) => {
    console.log(req.body)
    const blogToRead = { blogId: req.body.blog_id, userId: req.body.user_id}
    await ReadingLists.create(blogToRead)
    res.json(blogToRead)
    })

router.put('/:id', tokenExtractor, async (req, res) => {
    const readBlog = await ReadingLists.findByPk(req.params.id)
    console.log(readBlog.toJSON())
    if (readBlog && readBlog.userId === req.decodedToken.id) {
      readBlog.read = true
      await readBlog.save()
      res.json(readBlog)
    } else {
        res.status(404).end()
      }
  })

module.exports = router