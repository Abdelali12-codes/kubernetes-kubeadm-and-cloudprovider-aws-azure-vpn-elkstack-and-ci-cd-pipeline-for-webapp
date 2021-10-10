const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const url = process.env.DATABASE_URL || 'mongodb://mongo-db:27017/abdelali_db'

mongoose.set('useCreateIndex', true)
mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

fs.readdirSync(path.join(__dirname, '/models')).forEach(file => {
  require('./models/' + file)
})
