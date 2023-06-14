export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getUsers() {
    return await this.dao.getUsers()
  }

  async getUserById(id) {
    return await this.dao.getUserById(id)
  }

  async getUserByEmail(email) {
    return await this.dao.getUserByEmail(email)
  }

  async createUser(data) {
    return await this.dao.createUser(data)
  }

  async updateUser(id, data) {
    return await this.dao.updateUser(id, data)
  }
  async deleteUser(id) {
    return await this.dao.deleteUser(id)
  }
  async deleteInactiveUsers() {
    return await this.dao.deleteInactiveUsers()
  }

  async getUserByToken(token) {
    return await this.dao.getUserByToken(token)
  }
  async findInactiveUsers() {
    return await this.dao.findInactiveUsers()
  }



}
