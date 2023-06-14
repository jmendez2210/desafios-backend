import cartValidator from "../validators/cartsValidator.js";
import config from "../config/config.js";
import nodemailer from 'nodemailer'



const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 3000,
  auth: {
    user: config.mail_account,
    pass: config.mail_pass
  }
})

class cartController {


  async getCarts(req, res) {

    let limit = parseInt(req.query.limit)
    let json = (req.query.json)

    try {
      const result = await cartValidator.getCarts(limit)
      req.logger.debug(result)
      if (json) res.status(200).json(result)
      else res.render('carts', { result, styleRoute: `<link href="/styles/carts.css" rel="stylesheet">` })
    } catch (error) {
      req.logger.error(`Funcion getCarts en controlador: ${error.message}`)
      res.json(error)
    }
  }


  async getCartById(req, res) {
    let json = req.query.json
    try {

      const result = await cartValidator.getCartById(req.params.cid)
      req.logger.debug(`Resultado de getCartbyId en controler ${result}`)
      if (json) res.status(200).json(result)
      else res.render('cartById', { result, title: "Search Cart", styleRoute: `<link href="/styles/cartbyid.css" rel="stylesheet">` })
    } catch (error) {
      req.logger.error(`Funcion getCartById en controlador: ${error.message}`)
      res.status(404).json(error.message)
    }
  }

  async createCart(req, res) {
    console.log(req.user.user)
    try {
      await cartValidator.createCart()
      await transport.sendMail({
        from: 'German <german.alejandrozulet@gmail.com>',
        to: req.user.user,
        subject: 'Carrito nuevo creado',
        html: `
         <div>
          <h1> Hey! Has creado un carrito exitosamente! </h1>
        </div> 
`, attachments: []

      })
      req.logger.info("Mail has been sent")
      res.status(201).json({ info: 'Cart Created' })
    } catch (error) {
      req.logger.error(`Funcion createCart en controlador: ${error.message}`)
      res.status(400).json({ info: `Something has happened: ${error}` })
    }


  }

  async updateCart(req, res) {
    const cid = (req.params.cid)
    const { quantity, pid } = req.body;
    const product = { product: pid, quantity: quantity }
    // Variable booleana para evitar que se intente enviar dos headers en una misma respuesta, si enmbargo, es un problema exclusivo de este funcion, no rompe el programa pero es algo para revisar
    let responseSent = false
    try {
      const user = req.user
      await cartValidator.updateCart(cid, product, user)
      req.logger.info("Product has been updated")
      res.status(200).json({ message: "Producto agregado al carrito", payload: await cartValidator.getCartById(cid) })
      responseSent = true
    } catch (error) {
      if (responseSent = false) {
        req.logger.error(`Funcion updateCart en controlador: ${error.message}`)
        res.status(400).json({ error: error.message })
        responseSent = true

      }
    }
  }

  async updateQuantityFromCart(req, res) {
    req.logger.debug("Actualizando cantidad de producto")
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      await cartValidator.updateQuantityToCart(cid, pid, quantity)
      req.logger.info("Quantity of product has been updated")
      res.json({ message: "Quantity Updated", payload: await cartValidator.getCartById(cid) })
    } catch (error) {
      console.log(error)
      req.logger.error(`Funcion updateQuantityFromCart en controlador: ${error.message}`)
      res.json({ error: error })

    }

  }

  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;
    console.log(cid)
    console.log(pid)
    try {
      await cartValidator.deleteProductFromCart(cid, pid)
      req.logger.info("Product has been deleted from cart")
      res.json({ message: `PID: ${pid} has been deleted from cart ${cid}`, payload: await cartValidator.getCartById(cid) })
    } catch (error) {
      req.logger.error(`Funcion deleteProductFromCart en controlador: ${error.message}`)

      res.json({ error: error.message })
    }
  }



  async emptyCart(req, res) {
    let { cid } = (req.params)
    try {
      await cartValidator.emptyCart(cid)
      req.logger.info("Cart has been emptied")
      res.json({ status: 200, message: 'Cart Eliminated' })
    } catch (error) {
      req.logger.error(`Funcion emptyCart en controlador: ${error.message}`)

      res.json({ error })
    }
  }


  async purchase(req, res) {


    let { cid } = (req.params)
    let user = req.user


    try {
      const result = await cartValidator.purchase(cid, user)
      req.logger.info("cart has been purchased")
      res.json({ message: "Se ha generado el siguiente ticket:", result })
    } catch (Error) {
      req.logger.error(`Funcion purchase en controlador: ${Error.message}`)
      res.json({ error: Error.message })


    }

  }


}

export default new cartController()
