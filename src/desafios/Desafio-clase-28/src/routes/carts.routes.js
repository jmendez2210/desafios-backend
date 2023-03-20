
import { Router } from 'express'
import cartController from '../controllers/carts.controller.js'

const router = Router()


router.get('/', cartController.getCarts)
router.get('/:cid', cartController.getCartById)
router.post('/', cartController.createCart)
router.put('/:cid', cartController.updateCart) 
router.put('/:cid/products/:pid', cartController.updateQuantityFromCart)  
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart)
router.delete('/:cid', cartController.emptyCart) 


export default router; 


