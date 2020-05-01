const mongoose = require('mongoose')

const kbArticleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 2000,
  },
  currentState: {
    type: Object,
    required: true,
  },
  lastModifier: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
  },
  modified: {
    type: Date,
    default: Date.now,
  },
})

kbArticleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('KbArticle', kbArticleSchema)
