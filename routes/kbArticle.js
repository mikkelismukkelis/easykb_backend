const router = require('express').Router()
const verifyToken = require('../utils/verifyToken')
const KbArticle = require('../model/KbArticle')
const { kbArticleValidation } = require('../utils/validation')

// get all kb articles
router.get('/', verifyToken, (req, res) => {
  KbArticle.find({}).then((kbArticles) => {
    res.json(kbArticles)
  })
})

// get one kb article
router.get('/:id', verifyToken, (req, res) => {
  KbArticle.findById(req.params.id).then((kbArticle) => {
    if (!kbArticle) {
      res.status(404).send('No kb article found with that id')
    } else {
      res.json(kbArticle.toJSON())
    }
  })
})

// delete kb article
router.delete('/:id', verifyToken, (req, res) => {
  KbArticle.findByIdAndDelete(req.params.id)
    .then((kbArticle) => {
      if (!kbArticle) {
        res.status(404).send('No kb article found with that id')
      } else {
        res.json(kbArticle.toJSON())
      }
    })
    .catch((e) => {
      res.send(e)
    })
})

// save kb article to database
router.post('/', verifyToken, (req, res) => {
  const body = req.body

  // console.log('BODY: ', body)

  // //   Validate kb article data
  // const { error } = kbArticleValidation(body)
  // if (error) return res.status(400).send(error.details[0].message)

  // New kb article
  const kbarticle = new KbArticle({
    name: body.name,
    currentState: body.currentState,
    modified: Date.now(),
    lastModifier: req.user.email,
    // lastModifier: 'KOVAKOODATTU@OSOITE.COM',
  })

  kbarticle
    .save()
    .then((savedKbArticle) => {
      res.json(savedKbArticle.toJSON())
    })
    .catch((e) => {
      res.send(e)
    })
})

// modify kb article in database
router.put('/:id', verifyToken, (req, res) => {
  const body = req.body

  // //   Validate kb article data
  // const { error } = kbArticleValidation(req.body)
  // if (error) return res.status(400).send(error.details[0].message)

  // modified kb article
  const kbarticle = {
    name: body.name,
    currentState: body.currentState,
    modified: Date.now(),
    lastModifier: req.user.email,
  }

  KbArticle.findByIdAndUpdate(req.params.id, kbarticle, { new: true })
    .then((updatedKbArticle) => {
      if (!updatedKbArticle) {
        res.status(404).send('No kb article found with that id')
      } else {
        res.json(updatedKbArticle.toJSON())
      }
    })
    .catch((e) => {
      res.send(e)
    })
})

module.exports = router
