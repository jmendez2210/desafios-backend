import cartsServices from "../services/carts.services.js";
import productServices from "../services/product.services.js";

class cartsValidator {

  async getCarts(limit) {
    try {
      const carts = await cartsServices.find(limit)
      return carts
    } catch (error) {
      return error;

    }
  }

  async getCartById(cid) {
    try {
      const carts = await cartsServices.findById(cid)
      return carts
    } catch (error) {
      return error
    }
  }

  async createCart(cart) {
    try {
      await cartsServices.createCart(cart)
    } catch (error) {
      return error;
    }
  }

  async updateCart(cid, product) {
    //VERIFICANDO EXISTENCIA DE PRODUCTO EN BASE DE DATOS
   let enExistencia = await productServices.findById(product.product)
    try {
      if (!cid) throw new Error("Missing CID")
      if (!enExistencia) throw new Error("Product not found in DB")
      
      await cartsServices.updateCart(cid,product)
    } catch (error) {
      return error;
    }
  }

  async updateQuantityFromCart(cid,pid, quantity) {
    try {
      if (!cid) throw new Error("Missing CID")
      if (!pid) throw new Error("Missing PID")
      if (!quantity) throw new Error("Missing QUANTITY")
      await cartsServices.updateQuantityToCart(cid,pid,quantity) } catch (error) {
      return error;
    }
  }



  async deleteProductFromCart(cid,pid) {
    try {
      if (!pid) throw new Error("Missing PID")
      if (!cid) throw new Error("Missing CID")
      await cartsServices.deleteProductFromCart(cid,pid)
    } catch (error) {
      return error;
    }
  }


  async emptyCart(cid) {
    try {
      if (!cid) throw new Error("Missing CID")
      await cartsServices.emptyCart(cid)
    } catch (error) {
      return error;
    }
  }

}


export default new cartsValidator()

