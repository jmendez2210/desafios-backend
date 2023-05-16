import request from 'supertest'
import chai from "chai";
import mongoose from 'mongoose'
import cartsMongo from '../src/dao/mongo/carts.mongo.js';
import config from '../src/config/config.js';
import { faker } from '@faker-js/faker';



mongoose.set('strictQuery', false)
mongoose.connect(config.MONGO_URI, (error) => {
  if (error) {
    console.log('Cannot connect to database' + error)
    process.exit()
  }
})



const server = request.agent('http://127.0.0.1:3000');
const expect = chai.expect;

describe('Carts Routes', function() {



  it('Se loguea usuario para acceder  con permisos', loginUser());


  describe('Ruta /', async () => {

    before(function() {
      this.cartsDao = cartsMongo
    })


    it('Responde con vista renderizada', function(done) {
      server
        .get('/api/carts')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.text).to.contain(`Carritos`)
          done()
        });
    });






  })


  describe('Ruta /:cid (Buscando carrito por ID)', async () => {

    it('Responde con vista renderizada', function() {
      server
        .get('/api/carts/644fd84c4ae287d5c606f29c')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.text).to.contain("Search Cart")
        })
    })

    it('Trae un objeto exitosamente tras colocar un carrito que existe', async function() {

      server
        .get('/api/carts/642969b352810e11864fccaa')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.text).to.contain("Productos por carrito")
        })
    });


    it('Responde con mensaje de error si el id es incorrecto', async function() {
      server
        .get('/api/carts/as644fd84c4ae287d5c606f29c')
        .expect(404)
        .end(function(err, res) {
          expect(res.text).to.contain("Carrito no encontrado")
        })
    });


  })





  describe('Ruta POST)', () => {



    it('Crea un carrito', function(done) {


      this.timeout(4000)
      server
        .post('/api/carts')
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.info).to.contain("Cart Created")
          done()
        })

    })

    it('Compra un carrito', function(done) {

      server
        .post('/api/carts/642969b352810e11864fccaa/purchase')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          //hacer un console log aca 
          expect(res.body).to.be.an('object')
          done()
        })

    })



  })




})


describe('Ruta PUT (Modificar carrito)', () => {

  let productID;

  it('Modificar un carrito para agregar un producto', function(done) {


    const data = {
      quantity: 20,
      pid: "644fd84c4ae287d5c606f29c"
    }

    server
      .put('/api/carts/642969b352810e11864fccaa')
      .send(data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.payload.products).to.be.an('array')
        expect(res.body.payload._id).to.be.contain('642969b352810e11864fccaa')
        let result = res.body.payload.products.pop()
        productID = result._id
        console.log(`El id del producto nuevo es ${productID}`)

        done()
      })

  })




  it('Modificar un carrito en cuanto a la cantidad  de un producto', function(done) {

    let data = { quantity: 15 }

    server
      .put(`/api/carts/642969b352810e11864fccaa/products/${productID}`)
      .send(data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        console.log("Lista de productos ")
        console.table(res.body.payload.products)
        expect(res.body.message).to.contain('Quantity Updated')
        expect(res.body.payload._id).to.be.equal('642969b352810e11864fccaa')

        done()
      })

  })



})




describe('Ruta DELETE ', () => {

  const data = {
    quantity: 20,
    pid: "6456f15e403ec56bf78e8ec2"
  }


  it('Elimina un producto de un carrito', function(done) {
    this.timeout(4000)
    let productToEliminate

    server
      .put('/api/carts/642969b352810e11864fccaa')
      .send(data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        let producto = res.body.payload.products.pop()
        productToEliminate = producto._id
      })


    setTimeout(() => {
      server
        .delete(`/api/carts/642969b352810e11864fccaa/products/${productToEliminate}`)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).to.contain(productToEliminate)
          done()
        })


    }, 3000);
  })







})








function loginUser() {
  return function(done) {
    server
      .post('/api/session/login')
      .send({ email: 'user@gmail.com', password: '1234' })
      .expect(302)
      .end(onResponse);

    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
  };
};
