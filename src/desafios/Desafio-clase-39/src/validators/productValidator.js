// import productServices from "../services/product.services.js";
import { ProductService as productServices } from "../repositories/index.js";
import CustomError from "../utils/CustomError.js";
import EErrors from "../utils/EErrors.js";
import generateProductErrorInfo from "../utils/generateProductErrorInfo.js";
import mockingProductsGenerator from '../utils/mockingProductsGenerator.js'
import { logger } from '../utils/logger.js'
class productValidator {

  async getProducts(limit, query, sort, page) {
    try {
      const products = await productServices.getProducts(limit, query, sort, page)
      return products
    } catch (error) {
      return error;

    }
  }

  async getMockingProducts() {
    try {
      const products = mockingProductsGenerator()
      return products;
    } catch (error) {
      return error
    }
  }


  async getProductById(pid) {
    if (!pid) throw new Error("Missing PID")
    try {
      const products = await productServices.getProductById(pid)
      console.log(products)
      return products
    } catch (error) {
      return error
    }
  }

  async createProduct(title, description, category, price, thumbnailName, code, stock, owner) {
    if (!title || !description || !category || !price || !thumbnailName || !code || !stock || !owner) {
      CustomError.createError({
        name: 'Error creating product',
        cause: generateProductErrorInfo({ title, description, category, price, code, stock }),
        message: "Error trying to create product",
        code: EErrors.MISSING_DATA
      })
    }



    try {
      const product = { title, description, category, price, thumbnailName, code, stock, owner }
      return await productServices.createProduct(product)
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateProduct(pid, updatedProduct) {
    try {
      if (!pid) throw new Error("Missing PID")
      if (updatedProduct.code) throw new Error("Code field cannot be changed")
      await productServices.updateProduct(pid, updatedProduct)
    } catch (error) {
      return error;
    }
  }


  async deleteProduct(pid, role) {
    try {
      if (!pid) throw new Error("Missing PID")
      if (!role) throw new Error("Missing Role")
      logger.debug(`El pid es: ${pid}`)

      const product = await productServices.getProductById(pid)


      logger.debug(`El producto buscado es ${product}`)
      logger.debug(`El rol del usuario es : ${role}`)
      logger.debug(`El rol del dueño del producto es: ${product.owner}`)


      if (product.owner === 'admin' && role === 'premium') {
        logger.error("intentando eliminar producto sin permisos")
        throw new Error("Error eliminando producto por permisos")
      }


      await productServices.deleteProduct(pid)
    } catch (error) {
      return error;
    }
  }


}


export default new productValidator()

