const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User } = require('../models')
const { Blog } = require('../models')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog
      }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let read = {
    [Op.in]: [true, false]
  }
  if ( req.query.read ) {
    read = req.query.read === "true"
  }
  const users = await User.findByPk(req.params.id, {
    attributes: ['username', 'name'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: {
          attributes: [ 'read', 'id' ],
          where: { read }
        }
      },]
  })
  res.json(users)
})

router.post('/', async (req, res) => {
    const { username, name, password } = req.body

    console.log(username, name, password)

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    console.log(passwordHash, name, username)

    const user = await User.create({
        name: name,
        username: username,
        passwordHash: passwordHash
    })

    res.json(user)
  })

router.put('/:username', async (req, res) => {
    console.log(req.body)
  console.log(req.body.newName)
  const user = await User.findOne({ where: { username: req.params.username } })
  console.log(user)
  if (user) {
    user.name = req.body.newName
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router