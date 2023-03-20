import { Router } from 'express'
import { uploader } from '../utils/multer.js'
// import productDao from '../dao/productDao.js'
import productsController from '../controllers/products.controller.js';





const router = Router()

router.get('/', productsController.getProducts) 
router.get('/:pid', productsController.getProductById)
router.post('/', uploader.single('thumbnail'), productsController.createProduct)
router.put('/:pid', productsController.editProduct)
router.delete('/:pid', productsController.deleteProduct)


export default router;

