import request from 'supertest'
import jwt from 'jsonwebtoken'
import chai from "chai";
import { faker } from '@faker-js/faker';

const expect = chai.expect;

const user = {
  email: 'admin@gmail.com',
  password: '1234'
};


// LOGIN
describe('Testeo de sessiones', () => {
  describe('Logueo', () => {
    it('should log in a user and set a JWT cookie', async () => {
      // Generar un token JWT válido
      const token = jwt.sign({ user: user.email }, 'coderSecret', { expiresIn: '1h' });

      // Hacer una solicitud POST a la ruta de inicio de sesión
      const response = await request('http://127.0.0.1:3000')
        .post('/api/session/login')
        .send({ email: user.email, password: user.password })
        .set('Cookie', `jwt=${token}`);
      expect(response.status).to.equal(302);
      expect(response.header).to.be.an('object');
      expect(response.header['set-cookie']).to.be.an('array')
      expect(response.header['set-cookie'][0]).to.contain(`coderCokieToken`)
    });
  })

  describe('Registrarse', () => {


    it('Should register an user', async () => {
      const newUser = {
        first_name: faker.internet.userName(),
        last_name: "test user from mocha",
        email: faker.internet.exampleEmail(),
        age: 30,
        phone: '+56995144469',
        password: '1234',
        role: 'admin'
      }

      const response = await request('http://127.0.0.1:3000')
        .post('/api/session/register')
        .send(newUser)
      expect(response.status).to.equal(200);
      expect(response.text).to.contain('login')
      expect(response.ok).to.be.true
    });
  })
});
