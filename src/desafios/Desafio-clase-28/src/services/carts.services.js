import cartDao from "../dao/cartDao.js"

class cartsServices {

  async find(limit ) {
    return await cartDao.getCarts(limit)
  }

  async findById(cid) {
    return await cartDao.getCartById(cid)
  }

  async createCart(cart) {
    return await cartDao.createCart(cart)
  }

  async updateCart(cid, product) {
    return await cartDao.updateCart(cid, product)
  }

  async updateQuantityToCart(cid,pid, quantity) {
    return await cartDao.updateQuantityToCart(cid, pid,quantity)
  }

  async deleteProductFromCart(cid,pid ) {
    return await cartDao.deleteProductFromCart(cid, pid)
  }


  async emptyCart(cid) {
    return await cartDao.emptyCart(cid)
  }

}

export default new cartsServices()
