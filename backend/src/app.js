const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/ping',(req,res)=>{
  res.json({ok:true, message:'pong'})
})

module.exports = app
