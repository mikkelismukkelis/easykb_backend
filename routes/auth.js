const router = require('express').Router()
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../utils/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  //   Validate user data
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if email allready registered
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send('Email already registered')

  //   hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
  })

  try {
    const savedUser = await user.save()
    // res.send({ user: savedUser._id })
    res.send({ savedUser })
  } catch (error) {
    res.status(400).send(error)
  }
})

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if email exist
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return res
      .status(400)
      .send('Email not registered, please check email or register')

  // Check password
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid password')

  // Sign and create token
  const token = jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.TOKEN_SECRET
  )

  // res.header('auth-token', token).send('Login OK')
  res.status(200).send({
    token,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })
})

module.exports = router
