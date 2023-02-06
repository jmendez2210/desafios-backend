import { cartModel } from '../dao/models/cart.models.js'

class cartDao {

  async getCarts(limit) {
      if (limit === 0 || !limit) {
        return await cartModel.find({})
      } else {
        return await cartModel.find({}).limit(limit);
    }
  }


  async getCartById(id) {
      return cartModel.findById(id)
  }


  async createCart(cart) {
    return await cartModel.create(cart)
  }

  async updateCart(id, product) {
    let carritoACargar = await cartModel.findById(id)
    carritoACargar.products.push(product)
    return await cartModel.findByIdAndUpdate(id, carritoACargar, { new: true })
  }

  async deleteCart(id) {
    return await cartModel.findByIdAndDelete(id)
  }
}

export default new cartDao();


