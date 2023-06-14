import chatValidator from "../validators/chat.validator.js"

class chatController {


  async getMessages(req, res) {
    try {
      const result = await chatValidator.getMessages({})
      return result
    } catch (error) {
      req.logger.error(`Funcion getMessages en controlador: ${error.message}`)
      return { error: `Error con mensaje: ${error.message}` }
    }
  }
  async createMessage(message) {
    try {
      await chatValidator.createMessage(message)
    } catch (error) {
      req.logger.error(`Funcion createMessage en controlador: ${error.message}`)
      return { error: `Error: ${error.message}` }
    }
  }
}

export default new chatController()
