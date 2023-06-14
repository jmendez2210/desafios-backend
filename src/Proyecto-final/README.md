## Caracteristicas / Features 

  -  Operaciones CRUD para productos, carritos y usuarios.
  -  Manejo de autenticaciones y autorizaciones con libreria passport.
  -  Sistema de logueo y registracion.
  -  Patrones de diseño como Factory y Repository.
  -  Carga de archivos con Multer. 
  -  Documentacion realizada con Swagger.
  -  Persistencia de sesion con cookies, usando JWT.
  -  Sistema de loggers con libreria Winston logger.
  -  Uso de Socket.io para funcionalidad de chat (actualmente fuera de servicio en deploy)
  -  Sistema de mensajeria con Twilio y Nodemailer.
  -  Renderizado desde servidor con libreria handlebars, con respuestas en formato JSON (pasando parametro ?json=true)
  -  Testing unitarios e integrales con librerias como Mocha, Chai y Supertest.
  -  Sistema de toasts con libreria IziToasts para respuestas desde el servidor.


### Scripts

npm run prod/dev : Correr app en modo desarrollo/produccion, solo cambia el puerto

npm run test:products   : Testeos con productos
npm run test:carts      : Testeos con carritos  
npm run test:sessions   : Testeos con usuarios y sesiones       

### Usabilidad con usuarios 

funcionalidades del administrador con la cuenta: 

user: admin@gmail.com
password: 1234

## Librerias utilizadas

 - Bcrypt 
 - Handlebars 
 - Commander 
 - Cookie-Parser
 - Cors
 - Express Mongoose 
 - Multer 
 - Nodemailer 
 - Passport
 - Socket.io 
 - Superagent
 - Swagger 
 - Twilio 
 - Winston Logger
 - Faker.js 
 - Mocha 
 - Chai 
 - DotEnv para uso de variables de entorno 