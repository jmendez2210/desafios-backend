import sessionValidator from '../validators/session.validator.js'
import jwt from "jsonwebtoken";

class sessionsController {

  async getLoginPage(req, res) {
    res.render('login')
  }

  async getCurrentProfile(req, res) {
    res.render('current', {user : req.user})
  }

  async getRegisterPage(req, res) {
    res.render('register')
  }

  async postToRegister(req, res) {
    res.send({ status: 'success', message: 'Usuario Registrado' })
  }

  async failedRegister(req, res) {
    console.log('Ha ocurrido un problema en el registro ')
    res.send({ status: 'failure', message: "Ha ocurrido un problema en la registracion" })
  }

  async postToLogin(req, res) {
    const { email, password } = req.body;

    const checkedAccount = await sessionValidator.checkAccount(email, password)

    if (checkedAccount === 'NoMailNorPassword') return res.send('Mail or password missing')
    if (checkedAccount === 'NoUser') return res.send('User has not been found')
    if (checkedAccount === 'IncorrectPassword') return res.send('Incorrect Password')
    if (checkedAccount) {
      const token = jwt.sign({ email, role: checkedAccount.role }, 'coderSecret', { expiresIn: '20m' }, { withCredentials: true });
      res.cookie('coderCokieToken', token, { maxAge: 60 * 60 * 60, httpOnly: true, withCredentials: false });
      res.redirect('/api/session/current')

    }

  }

  async getFailedRegisterPage(req, res) {
    console.log('Ha ocurrido un error en el registro')
    res.send({ status: 'failure', message: 'Ha ocurrido un error en el registro' })

  }

}



export default new sessionsController()
