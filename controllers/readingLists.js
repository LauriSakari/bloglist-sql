const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { ReadingList } = require('../models')

router.post('/', async (req, res) => {
  const blogToRead = { blogId: req.body.blog_id, userId: req.body.user_id }
  await ReadingList.create(blogToRead)
  res.json(blogToRead)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readBlog = await ReadingList.findByPk(req.params.id)

  if (readBlog && readBlog.userId === req.decodedToken.id) {
    readBlog.read = true
    await readBlog.save()
    res.json(readBlog)
  } else {
    res.status(404).end()
  }
})

module.exports = router