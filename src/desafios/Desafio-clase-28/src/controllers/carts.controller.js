import cartValidator from "../validators/cartsValidator.js";

class cartController {


  async getCarts(req, res) {

    let limit = parseInt(req.query.limit)

    try {
      const carts = await cartValidator.getCarts(limit)
      res.render('cart', {carts})
    } catch (error) {
      console.log(error.message)
      res.json(error)
    }
  }


  async getCartById(req, res) {
    const carts = await cartValidator.getCartById(req.params.cid)
    try {
      res.render('cart', {carts})
    } catch (error) {
      res.json(error)
    }
  }

  async createCart(req, res) {
    try {
      await cartValidator.createCart()
      res.status(201).json({ info: 'Cart Created' })
    } catch (error) {
      console.log("Something has happened", error)
      res.status(400).json({ info: `Something has happened: ${error}` })
    }


  }

  async updateCart(req, res) {
    const cid = (req.params.cid)
    const { quantity, pid } = req.body;
    const product = { product: pid, quantity: quantity }



    try {
      await cartValidator.updateCart(cid, product)
      res.send({ status: 200, payload: await cartValidator.getCartById(cid) })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async updateQuantityFromCart(req, res) {

    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      await cartValidator.updateQuantityFromCart(cid, pid, quantity)
      res.json({ message: "Quantity Updated", payload: await cartValidator.getCartById(cid) })
    } catch (error) {
      res.json({ error: error.message })

    }

  }

  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      await cartValidator.deleteProductFromCart(cid, pid)
      res.json({message:`PID: ${pid} has been deleted from cart ${cid}`, payload : await cartValidator.getCartById(cid)})
    } catch (error) {
      res.json({error:error.message})
    }
  }



  async emptyCart(req, res) {
    let {cid} = (req.params)
    try {
      await cartValidator.emptyCart(cid)
      res.json({ status: 200, message: 'Cart Eliminated' })
    } catch (error) {
      res.json({ error })
    }

  }


}

export default new cartController()
