import { Router } from 'express'
import CustomError from '../utils/CustomError.js'
import EErrors from '../utils/EErrors.js'

const router = Router()



router.get('/', (req, res) => {
  res.render('index')
})

router.get('*', (req, res) => {
  CustomError.createError({
    name: 'Error getting the page',
    cause: "Endpoint not found",
    message: "Cannot get the page you are looking for",
    code: EErrors.ROUTING_ERROR
  })


})



export default router;
