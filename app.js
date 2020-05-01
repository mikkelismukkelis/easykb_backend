// Import modules
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')

// Import routes
const authRoute = require('./routes/auth')
const kbArticleRoute = require('./routes/kbArticle')

// Misc variables
const PORT = process.env.PORT || 3001

// dotenv configuration
dotenv.config()

// Connect to database
mongoose.connect(
  process.env.DB_CONNECTION_STRING,
  // { useUnifiedTopology: true, useNewUrlParser: true },
  { useFindAndModify: false },
  () => console.log('Connected to database')
)

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// Route middlewares
app.use('/api/user', authRoute)
app.use('/api/kbarticle', kbArticleRoute)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
