import express from 'express'
import ProductManager from './ProductManager.js'
const app = express()
app.use(express.urlencoded({extended:true}))


app.get('/', (req,res) => {
  res.send('<h1>Bienvenido  mi nuevo server</h1')
})

app.get('/products',  (req,res) => {
  let limit = parseInt(req.query.limit)
 try {
  if (limit === 0 || !limit) {
     res.json(ProductManager.getProducts())
  } else {
     const arrayOriginal = ProductManager.getProducts()
    let limitado = arrayOriginal.slice(0,limit) 
    res.json(limitado)
  }
 } catch (error) {
   console.log("Error", error)
   res.send("Se ha presentado un error")
 }
  
})

app.get('/products/:pid',  async (req,res) => {
   let pid =   parseInt(req.params.pid); 
  let response =  await ProductManager.getElementById(pid)
  console.log(response)
   res.json(response || {"Error" : "Producto no encontrado"})
})

app.get('*', (req,res) => {
  res.send("Pagina no encontrada")
})



app.listen(8080, () => {
  console.log("Listening on port 8080")
})