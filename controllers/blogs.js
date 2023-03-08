const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
  })
  
router.post('/', async (req, res) => {
      console.log(req.body)
      const blog = await Blog.create(req.body)
      res.json(blog)
  })

router.put('/:id', async (req, res) => {
  console.log(req.body)
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    console.log(blog.likes)
    blog.likes = req.body.likes
    console.log(blog.likes)
    await blog.save()
    res.json(blog)
  } else {
      res.status(404).end()
    }
})
  
router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
  }
  res.status(204).end()
})

module.exports = router