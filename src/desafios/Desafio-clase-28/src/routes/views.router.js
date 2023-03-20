import {Router} from 'express'


const router = Router()



router.get('/', (req,res) => {
  res.send('Segunda Practica Integradora')
})



export default router;
