// import productServices from "../services/product.services.js";
import { ProductService as productServices } from "../repositories/index.js";
import CustomError from "../utils/CustomError.js";
import EErrors from "../utils/EErrors.js";
import generateProductErrorInfo from "../utils/generateProductErrorInfo.js";
import mockingProductsGenerator from '../utils/mockingProductsGenerator.js'
import { logger } from '../utils/logger.js'
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
      throw new Error('Producto no encontrado')
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


    if (typeof (title) !== 'string' || typeof (description) !== 'string' || parseInt(stock) === 'NaN' || parseInt(price) === 'NaN' || typeof (code) !== 'string') {
      throw new Error("One of your inputs is not the correct one, putting letters in price for example")
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


  async deleteProduct(pid, user, role) {
    try {
      if (!pid) throw new Error("Missing PID")
      if (!role) throw new Error("Missing Role")
      logger.debug(`El pid es: ${pid}`)

      const product = await productServices.getProductById(pid)


      logger.debug(`El producto buscado es ${product}`)
      logger.debug(`El rol del usuario es : ${role}`)
      logger.debug(`El rol del dueño del producto es: ${product.owner}`)

      console.log(product.owner)
      console.log(user)
      if (product.owner === 'admin' && role === 'premium') {
        logger.error("intentando eliminar producto sin permisos")
        throw new Error("Error eliminando producto por permisos")
      }

      if (((product.owner === user) && role === 'premium') || role === "admin") {
        await transport.sendMail({
          from: 'German <german.alejandrozulet@gmail.com>',
          to: user,
          subject: 'Su producto ha sido eliminado',
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Su producto ha sido eliminado</title>
</head>
<body>
  <div>
    <h1>Producto Eliminado</h1>
    <p>Estimado/a Usuario/a,</p>
    <p>Se ha seleccionado el producto para eliminar,  con las siguientes caracteristicas:</p>

<ul>
  <li>Nombre:${product.title}</li>
  <li>Descripcion: ${product.description}</li>
  <li>Categoria: ${product.category}</li>
  <li>Precio: $ ${product.price}</li>
</ul>


    <p>Si tienes alguna pregunta o necesitas ayuda, por favor contáctanos.</p>
    <p>Gracias,</p>
    <p>El equipo del alumno de CODERHOUSE</p>
  </div>
</body>
</html>
 
      `, attachments: []

        })
        await productServices.deleteProduct(pid)

      } else {
        throw new Error("No estas autorizado para realizar esta operacion, no eres dueño del producto")
      }


    } catch (error) {
      throw new Error(error)
    }
  }


}


export default new productValidator()

