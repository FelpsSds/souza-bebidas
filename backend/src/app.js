const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/ping',(req,res)=>{
  res.json({ok:true, message:'pong'})
})

// orders routes
const ordersRouter = require('./routes/orders')
app.use('/api/orders', ordersRouter)

const productsRouter = require('./routes/products')
app.use('/api/products', productsRouter)

module.exports = app
