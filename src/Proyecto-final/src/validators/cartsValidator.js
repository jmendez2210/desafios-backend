import twilio from 'twilio'
import config from "../config/config.js";
import { logger } from '../utils/logger.js'
import { CartsService as cartsServices, ProductService, UserService } from "../repositories/index.js";




class cartsValidator {
  async getCarts(limit) {
    try {
      const carts = await cartsServices.getCarts(limit)
      return carts
    } catch (error) {
      return error;
    }
  }

  async getCartById(cid) {
    try {
      const carts = await cartsServices.getCartById(cid)
      return carts
    } catch (error) {
      throw new Error('Carrito no encontrado')
    }
  }

  async createCart(cart) {
    try {
      await cartsServices.createCart(cart)
    } catch (error) {
      return error;
    }
  }

  async updateCart(cid, product, user) {
    let enExistencia = await ProductService.getProductById(product.product)
    logger.debug(`VAL:Comprobando que el producto exista en inventario ${enExistencia}`)
    logger.debug(`VAL:El owner del producto es ${enExistencia.owner}`)
    logger.debug(`VAL:usuario que intenta agregar el producto es : ${user.role}`)






    if (!cid) throw new Error("Missing CID")
    if (!enExistencia) throw new Error("Product not found in DB")
    if (user.role === 'premium' && enExistencia.owner === user.user) {
      throw new Error("A premium user cannot add to cart its own products")
    }
    let cart = await this.getCartById(cid)


    let foundInCart = (cart.products.find(el => (el.product._id).toString() === product.product))
    let productIndex = (cart.products.findIndex(el => (el.product._id).toString() === product.product))



    try {


      if (foundInCart != undefined) {
        logger.warning("VAL: 🧐 Se esta intentando agregar mas productos de los que hay")
        let productStock = cart.products[productIndex].product.stock
        let totalAmount = product.quantity + cart.products[productIndex].quantity
        let pidInCart = cart.products[productIndex]._id.toString()
        if (totalAmount > productStock) totalAmount = productStock
        await cartsServices.updateQuantityToCart(cid, pidInCart, totalAmount)
      } else {
        await cartsServices.updateCart(cid, product)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateQuantityToCart(cid, pid, quantity) {
    if (!cid) throw new Error("Missing CID")
    if (!pid) throw new Error("Missing PID")
    if (!quantity) throw new Error("Missing QUANTITY")
    try {
      await cartsServices.updateQuantityToCart(cid, pid, quantity)
    } catch (error) {
      return error;
    }
  }

  async deleteProductFromCart(cid, pid) {
    if (!pid) throw new Error("Missing PID")
    if (!cid) throw new Error("Missing CID")
    try {
      await cartsServices.deleteProductFromCart(cid, pid)
    } catch (error) {
      return error;
    }
  }
  async emptyCart(cid) {
    if (!cid) throw new Error("Missing CID")
    try {
      await cartsServices.emptyCart(cid)
    } catch (error) {
      return error;
    }
  }

  async purchase(cid, user) {
    const cartInExistence = await cartsServices.getCartById(cid)

    if (!cartInExistence) throw new Error("Missing CID")
    if (!user) throw new Error("Missing user")
    if (cartInExistence.products.length === 0) throw new Error("No products in cart")

    try {
      const client = twilio(config.twilio_account, config.twilio_token)

      const cartToModify = cartInExistence;
      let newListProducts = []
      let amount = 0;

      cartToModify.products.forEach(async (product) => {
        let productToUpdate = product.product._id.toHexString()

        if (product.quantity === product.product.stock) { 

          newListProducts.push(product) 
          amount += product.quantity * product.product.price
          await cartsServices.deleteProductFromCart(cid, (product._id).toHexString())
          await ProductService.updateProduct(productToUpdate, { stock: 0 })


        } else if (product.quantity <= product.product.stock) {
          let newProductQuantity = product.product.stock - product.quantity 
          amount += product.quantity * product.product.price
          newListProducts.push(product)
          await ProductService.updateProduct(productToUpdate, { stock: newProductQuantity }) 
          await cartsServices.deleteProductFromCart(cid, (product._id).toHexString())
        }

      })


      let code = Math.random().toString(36).slice(2, 27)
      const ticket = {
        cart: newListProducts,
        purchaser: user.user,
        amount: amount,
        code: code
      }


      await cartsServices.purchase(ticket)
      console.log(user.phone)
      let unOrderedProducts = await cartsServices.getCartById(cid)
      try {
        client.messages.create({
          body: 'Has realizado una compra',
          from: config.twilio_number,
          to: user.phone 
        })
          .catch(e => {
            return e
          })
        return { ticket: ticket, unOrderedProducts: unOrderedProducts, message: "solo se agregaran los productos con el stock disponible" };
      } catch (error) {
        throw new Error(error)
      }

    } catch (error) {
      throw new error(error)
    }
  }
}


export default new cartsValidator()

