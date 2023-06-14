import { Router } from "express";
import cartRoutes from './carts.routes.js'
import productRoutes from './products.routes.js'
import sessionRoutes from './session.routes.js'
import userRoutes from './user.routes.js'
import viewsRoutes from './views.router.js'
import chatRoutes from './chat.routes.js'

const router = Router()

router.use('/products', productRoutes)//✅
router.use('/carts', cartRoutes)
router.use('/chat', chatRoutes)
router.use('/session', sessionRoutes)
router.use('/users', userRoutes)
router.use('/', viewsRoutes)


export default router;

