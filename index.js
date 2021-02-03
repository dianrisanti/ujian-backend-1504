const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')

// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyparser.json())

require('dotenv').config()
const db = require('./database')

db.connect((err) => {
    if(err) return console.log(`Error connecting: ${err.stack}`)
    console.log(`Connected as id: ${db.threadId}`)
})

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)

const { userRouter, movieRouter } = require('./routers')
app.use('/user', userRouter)
app.use('/movies', movieRouter)

// bind to local machine
const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`CONNECTED : port ${PORT}`))