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

const categoriesRouter = require('./routes/categories')
app.use('/api/categories', categoriesRouter)

const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter)

const uploadsRouter = require('./routes/uploads')
app.use('/api/uploads', uploadsRouter)

const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')))

module.exports = app
