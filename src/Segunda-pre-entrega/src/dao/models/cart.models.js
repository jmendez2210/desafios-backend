import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: String,
      quantity: Number,
    }
  ]
})


export const cartModel = mongoose.model(cartCollection, cartSchema)