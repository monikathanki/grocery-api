require('dotenv').config()
let express = require('express')
let morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
let { NODE_ENV } = require('./config')
let errorHandler = require('./error-handler')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';


app.use(morgan(morganOption))
app.use(helmet())


app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(errorHandler)

app.use(cors())

module.exports = app