import { UserService } from "../repositories/index.js"

const roleValidation = () => {
  return async (req, res, next) => {
    const user = await UserService.getUserById(req.params.uid) 
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    const identification = user.documents.find(el => el.name === "identification")
    const location = user.documents.find(el => el.name === "location")
    const accountStatus = user.documents.find(el => el.name === "accountStatus")

    if ((!identification | !location | !accountStatus) && user.role === "user") {
      console.log("Usuario sin documentos")
      return res.status(403).json({ message: 'El usuario posee permisos premium' })
    }
    next()
  }
}

export default roleValidation
