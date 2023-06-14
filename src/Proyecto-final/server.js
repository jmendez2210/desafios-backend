import express from 'express'
import handlebars from 'express-handlebars'
import Handlebars from 'handlebars'
import __dirname from './dirname.js'
import routes from './src/routes/index.routes.js'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import { swaggerOptions } from './src/docs/swaggeroptions.js'
import swaggerUi from 'swagger-ui-express'
import { Server } from 'socket.io'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import initializePassport from './src/config/passport.config.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import config from './src/config/config.js'
import errorHandler from './src/middlewares/errors/index.js'
import { addLogger } from './src/utils/logger.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Inicializacion de websocket por lado de servidor
const httpServer = app.listen(config.PORT, () => console.log(`${config.PORT}`))
export const io = new Server(httpServer, {
  cors: {
    origin: "https://e-commerce-backend-production-a1b2.up.railway.app/"
  }
})


// CONFIGURACION DE HANDLEBARS
app.engine('hbs', handlebars.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

//Swagger 
const specs = swaggerJSDoc(swaggerOptions)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs))

// Midlewares
app.use(express.static(path.join(__dirname, '/src/public')));
app.set('views', __dirname + '/src/views')
app.set('view engine', 'hbs')
app.use(cookieParser())
app.use(errorHandler)
app.use(addLogger)


// ROUTES  
app.get('/', (req, res) => {
  req.logger.warning('Se accedio por ruta indefinida')
  res.redirect('/api')
})
app.use('/api', routes)


// CORS
app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:8000",
  }));

// PASSPORT 
initializePassport()
app.use(passport.initialize())
app.use(passport.session())




