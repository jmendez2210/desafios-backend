import passport from 'passport';
import jwt from 'passport-jwt';
import local from 'passport-local'
import usersDao from '../dao/UsersDao.js'
import { hashPassword as createHash } from '../utils/CryptUtil.js'; 

const LocalStrategy = local.Strategy;
const headersExtractor = (req) => {
  let token = null;
  if (req && req.headers) {
    token = req.headers["Authorization"];
  }
  return token;
}

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCokieToken"];
  }
  return token;
}

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy({
      jwtFromRequest : cookieExtractor,
      secretOrKey: "coderSecret"
    },
    async (jwtPayload, done) => {
      try {
        return done(null, jwtPayload)
      } catch (error) {
        done(error);
      }
    })
  )


  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      const { first_name, last_name, email, age,role } = req.body;
      try {
        let user = await usersDao.getByEmail(username)

        if (user) {
          console.log('Usuario ya existe')
          return done(null, false)
        }
        const newUser = {
          first_name,
          last_name,
          username: first_name + ' ' + last_name,
          email,
          age,
          role,
          password: createHash(password)
        }
        console.log(newUser)
        let result = await usersDao.create(newUser)
        return done(null, result)
      } catch (error) {
        done(error)
      }
    }
  ))


}


export default initializePassport;
