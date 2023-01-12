import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import homeRouter from './src/routes/home.routes.js'
import ProductManager from './src/helpers/ProductManager.js'
import { Server } from 'socket.io'

//Inicializacion de servidor con express
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Inicializacion de websocket por lado de servidor
const httpServer = app.listen(8080, () => console.log("Listening on port 8080"))
const io = new Server(httpServer)

// Seteo de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/src/views/')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + './public'))
app.use('/', homeRouter)

// Routes
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts')
})

// Manejo de persistencia con clase 
let historial = ProductManager.getProducts()

// Configuracion servidor Socket
io.on('connection', (socket) => {
  console.log("Se ha conectado el socket con id : !", socket.id)
  // Para carga de productos al inicio de pagina realtimeproducts
  socket.emit("arrayProductos", historial)

  // Para agregar productos nuevos
  socket.on("newProduct", (data) => {
    ProductManager.addProduct(data)
    io.emit("arrayProductos", historial)
    console.log("Se ha agregado un producto")
  })

  //Para eliminar productos 
  socket.on("eliminarProducto", id => {
    ProductManager.deleteProduct(id)
    io.emit("arrayProductos", historial)
    console.log("Se ha eliminado un producto")
  })

})




