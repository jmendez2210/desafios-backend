import usersDao from "../dao/UsersDao.js";

class sessionServices {
  async checkEmail(email) {

    try {
      const user = await usersDao.getByEmail(email);
      return user;
    } catch (error) {
      return error.message
    }
  }
}


export default new sessionServices()
