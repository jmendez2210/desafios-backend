import { Router } from 'express'
import {uploader } from '../utils/multer.js'
import ProductManager from '../utils/ProductManager.js'


const router = Router()

// METODO GET PARA LISTAR PRODUCTOS
router.get('/', (req, res) => {
  let limit = parseInt(req.query.limit)
  try {
    if (limit === 0 || !limit) {
      res.status(200).json(ProductManager.getProducts())
    } else {
      const arrayOriginal = ProductManager.getProducts()
      let arrayConLimite = arrayOriginal.slice(0, limit)
      res.status(202).json(arrayConLimite)
    }
  } catch (error) {
    res.status(400).json({ info: "Ha ocurrido un error", error })
  }
})

//METODO PARA OBTENER PRODUCTO POR ID
router.get('/:pid', async (req, res) => {
  let pid = parseInt(req.params.pid);
  let response = await ProductManager.getElementById(pid)
  res.json(response || { "Error": "Producto no encontrado" })
})

router.post('/', uploader.single('thumbnail'), async (req, res) => {
  const { title, description, category, price, thumbnail, code, stock } = req.body;
  !req.file && res.status(400).send({status:"error", error : "No se pudo guardar la imagen"}) 
   await ProductManager.addProduct(title, description,category, price, req.file.path, code, stock) 
   ? res.status(201).json({ info: "Se ha agregado producto" }) 
   : res.status(406).json({ info: "Producto ya presente en lista" })
})

router.put('/', async (req, res) => {
  const { id, campo, valorNuevo } = req.body;
  await ProductManager.updateProduct(id, campo, valorNuevo) 
  ? res.status(200).json({ info: "El Producto Actualizado" }) 
  : res.status(400).json({ error: "Verifique el campo agregado,no puede modificar el id" })

})

router.delete('/:pid', async (req, res) => {
  let pid = parseInt(req.params.pid)
  await ProductManager.deleteProduct(pid) 
  ? res.status(200).json({ info: "El Producto se ha Eliminado!" })
  : res.status(400).json({ error: "El producto no ha sido encontrado por su id" })
})

export default router;

