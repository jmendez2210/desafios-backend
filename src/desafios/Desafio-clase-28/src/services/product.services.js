import productDao from "../dao/productDao.js";

class productService {

  async find(limit, query, sort, page) {

    return await productDao.getProducts(limit, query, sort, page)
  }

  async findById(pid) {
    return await productDao.getProductById(pid)
  }

  async createProduct(title, description, category, price, thumbnailName, code, stock) {
    try {
      let product = { title, description, category, price, thumbnailName, code, stock }
      return await productDao.createProduct(product)
    } catch (error) {
      return error
    }
  }

  async editProduct(pid, updatedProduct) {
    return await productDao.updateProduct(pid, updatedProduct)
  }

  async deleteProduct(pid) {
    return await productDao.deleteProduct(pid)
  }

}

export default new productService()
