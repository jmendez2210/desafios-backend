import request from 'supertest'
import chai from "chai";
import mongoose from 'mongoose'
import config from '../src/config/config.js';
import productsMongo from '../src/dao/mongo/products.mongo.js';
import mockingProductGenerator from '../src/utils/mockingProductsGenerator.js';
import { faker } from '@faker-js/faker';
import productValidator from '../src/validators/productValidator.js';



mongoose.set('strictQuery', false)
mongoose.connect(config.MONGO_URI, (error) => {
  if (error) {
    console.log('Cannot connect to database' + error)
    process.exit()
  }
})


const server = request.agent('http://127.0.0.1:3000');
const expect = chai.expect;

describe('Products Routes', function() {


  it('Se loguea usuario para acceder  con permisos', loginUser());
  before(function() {
    this.productDao = productsMongo
  })

  describe('Ruta /', async () => {
    it('Responde con vista renderizada', function(done) {
      server
        .get('/api/products')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.text).to.contain(`Productos`)
          done()
        });
    });

    it('Trae un array de objetos', async function() {
      const result = await this.productDao.getProducts()
      expect(result.docs).to.be.an('array')
    });


    it('Trae un array de objetos no vacio', async function() {
      const result = await this.productDao.getProducts()
      expect(result.docs).to.have.lengthOf.at.least(1)
    });
  })


  describe('Ruta /Mockingproducts', async () => {
    it('Responde con array de objetos', function(done) {
      server
        .get('/api/products/mockingproducts')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an('array')
          done()
        });
    });


  })

  describe('Ruta /:pid (Buscando producto por ID)', async () => {

    it('renderiza con vista', function() {
      server
        .get('/api/products/644fd84c4ae287d5c606f29c')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.text).to.contain("Search")
        })
    })

    it('Trae un objeto es exitosamente tras colocar un producto que existe', async function() {
      server
        .get('/api/products/644fd84c4ae287d5c606f29c')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.text).to.contain("Search")
        })
    });
    it('error si el id es incorrecto', async function() {
      server
        .get('/api/products/asdsa644fd84c4ae287d5c606f29c')
        .expect(404)
        .end(function(err, res) {
          expect(res.text).to.contain("Producto no encontrado")
        })
    });


  })



  describe('Ruta POST)', () => {



    it('Crea un producto', function(done) {
      let productId = null



      const product = {
        title: "Test Product",
        description: "Test description",
        category: "Test Category",
        price: faker.commerce.price(100, 500),
        code: faker.random.alphaNumeric(7),
        status: true,
        stock: faker.datatype.number(200),
      }

      server
        .post('/api/products')
        .send(product)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.info).to.contain("Producto Agregado")
          expect(res.body.addedProduct.title).to.contain("Test Product")
          expect(res.body.addedProduct).to.be.an('object')
          productId = res.body.addedProduct._id
          done()
        })

    })





  })


  describe('Ruta PUT (Modificar producto)', () => {

    it('Modificar un producto', function(done) {

      const fecha = new Date()
      const hora = fecha.getHours()

      const product = {
        title: `Test Product modificado en la hora ${hora}`,
        price: faker.commerce.price(100, 500),
        code: faker.random.alphaNumeric(7),
        status: true,
        stock: faker.datatype.number(200),
      }

      server
        .put('/api/products/6456dea06e617ff5f91a7938')
        .send(product)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.payload.title).to.contain(`${hora}`)
          done()
        })
    })


  })
  describe('Ruta Delete (Eliminar producto)', () => {


    it('Elimina un producto', function(done) {
      let productId = null

      const productToDelete = {
        title: `Producto to eliminate `,
        description: "Test description",
        category: "Test Category",
        price: faker.commerce.price(100, 500),
        code: faker.random.alphaNumeric(7),
        status: true,
        stock: faker.datatype.number(200),
      }


      server
        .post('/api/products')
        .send(productToDelete)
        .end(function(err, res) {
          if (err) return done(err)
          productId = res.body.addedProduct._id
        })

      setTimeout(() => {




        server
          .delete(`/api/products/${productId}`)
          .expect(200)
          .end(async function(err, res) {
            if (err) return done(err)
            expect(res.body.payload.docs).to.not.contain(`${productId}`)
            done()
          })
      })
    }, 1500);
  })
});


function loginUser() {
  return function(done) {
    server
      .post('/api/session/login')
      .send({ email: 'admin@gmail.com', password: '1234' })
      .expect(302)
      .end(onResponse);

    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
  };
};
