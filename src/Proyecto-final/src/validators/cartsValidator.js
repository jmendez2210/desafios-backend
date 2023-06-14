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
    //VERIFICANDO EXISTENCIA DE PRODUCTO EN BASE DE DATOS
    let enExistencia = await ProductService.getProductById(product.product)
    logger.debug(`VAL:Comprobando que el producto exista en la base de datos ${enExistencia}`)
    logger.debug(`VAL:El owner del producto es ${enExistencia.owner}`)
    logger.debug(`VAL:El rol del usuario que intenta agregar el producto es : ${user.role}`)






    if (!cid) throw new Error("Missing CID")
    if (!enExistencia) throw new Error("Product not found in DB")
    if (user.role === 'premium' && enExistencia.owner === user.user) {
      throw new Error("A premium user cannot add to cart its own products")
    }
    let cart = await this.getCartById(cid)

    // Verificamos si ya sta en el carrito
    let foundInCart = (cart.products.find(el => (el.product._id).toString() === product.product))
    let productIndex = (cart.products.findIndex(el => (el.product._id).toString() === product.product))



    try {


      // Si esta en el carrito, ubicamos su id en el carrito
      if (foundInCart != undefined) {
        logger.warning("VAL: 🧐 Se esta intentando agregar mas productos de los que hay")
        let productStock = cart.products[productIndex].product.stock
        // Ubicamos la cantidad solicitada en el carrito, y la sumamos con la cantidad que tenemos aca
        let totalAmount = product.quantity + cart.products[productIndex].quantity
        let pidInCart = cart.products[productIndex]._id.toString()
        // La cantida total no puede superar la cantidad de stock que tenemos en el producto, si la supera, va a ser directamente el total
        if (totalAmount > productStock) totalAmount = productStock
        // Una vez ubicamos su id, llamamos a la funcion para actualizar la cantidad
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



        if (product.quantity === product.product.stock) { // Si el stock y la cantidad necesitada es igual, tenemos que sacar eso del carrito original cliente y pasarlo al ticket

          newListProducts.push(product) // Agregamos los productos que cumplieron las condiciones
          amount += product.quantity * product.product.price
          await cartsServices.deleteProductFromCart(cid, (product._id).toHexString())
          await ProductService.updateProduct(productToUpdate, { stock: 0 }) // Descontamos del stock de la DB


        } else if (product.quantity <= product.product.stock) {


          let newProductQuantity = product.product.stock - product.quantity // Calculamos que es lo que nos queda del stock original
          amount += product.quantity * product.product.price
          newListProducts.push(product) // Agregamos los productos que cumplieron las condiciones
          await ProductService.updateProduct(productToUpdate, { stock: newProductQuantity }) // Descontamos del stock de la DB
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
          to: user.phone // EN EL TELEFONO SIEMPRE AGREGAR EL PREFIJO +54, SI NO, NO LO VA A TOMARK
        })
          .catch(e => {
            return e
          })
        return { ticket: ticket, unOrderedProducts: unOrderedProducts, message: "Los productos no agregados son aquellos que superan las cantidades de stock disponible" };
      } catch (error) {
        throw new Error(error)

      }


    } catch (error) {
      throw new error(error)

    }

  }


}


export default new cartsValidator()

