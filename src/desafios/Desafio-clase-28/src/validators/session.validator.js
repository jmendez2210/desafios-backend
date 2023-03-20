import sessionServices from '../services/session.services.js'
import { comparePassword } from '../utils/CryptUtil.js'


class sessionValidator {


  async checkAccount(email, password) {

    const user = await sessionServices.checkEmail(email)

    if(!email || !password) return 'NoMailNorPassword'
    if(!user) return 'NoUser'
    if(!comparePassword(user,password)) return 'IncorrectPassword'

    return user;



  }
}

export default new sessionValidator()
