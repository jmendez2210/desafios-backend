import express from 'express'
import productRoutes from './routes/products.routes.js'
import cartRoutes from './routes/carts.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRoutes)
app.use('/api/carts', cartRoutes)

app.listen(3000, () => console.log('Listening on port 3000'))