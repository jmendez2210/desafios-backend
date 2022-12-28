
import { Router } from 'express'
import CartManager from '../utils/CartManager.js'
import ProductManager from '../utils/ProductManager.js'

const router = Router()

router.get('/:cid', (req, res) => {
  const cid = parseInt(req.params.cid)
  CartManager.getCart(cid) 
  ? res.status(200).json(CartManager.getCart(cid))
  : res.status(404).json({Error:"No se ha encontrado el carrito"})
})

 router.post('/', (req,res) => {
  CartManager.createCart()
  res.status(200).send({Info: "Carrito creado"})
}) 

router.post('/:cid/product/:pid', async (req,res) => {
  const {cid, pid} = req.params;
  const {quantity} = req.body; 
  // Validando si tenemos un producto en nuestra lista con el id que queremos agregar al carrito
  let enExistencia = ProductManager.getProducts().some(el => el.id === Number(pid))
  if (!enExistencia) res.status(404).json({"error":"El producto no se encuentra en la base de datos"})
  else { 
  await CartManager.addToCart(Number(cid),Number(pid),quantity) 
  ? res.status(201).json({Info:`Elementos agregados a carrito numero ${Number(cid)}`})
  : res.status(400).json({error:"Ha ocurrido un error agregado productos, asegurese de proveer el numero de carrito correcto"})

  }
})

export default router; 