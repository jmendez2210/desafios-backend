import { Router } from 'express'
import express from 'express'
import ProductManager from '../helpers/ProductManager.js'

const router = express.Router()
let productosCargados = ProductManager.getProducts()



router.get('/', (req, res) => {
  res.render('home', {productosCargados})
})





export default router;
