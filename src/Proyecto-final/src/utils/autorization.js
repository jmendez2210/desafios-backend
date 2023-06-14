const authorization = (role) => {
  return async (req, res, next) => {
    req.logger.debug(`para autorizar, el usuario es: ${req.user.role}`)
    if (!req.user) {
      return res.status(401).json({ message: 'Not logged in' })
    }
    let permiso = false
    role.forEach(rol => {
      if (req.user.role === rol) {
        permiso = true
      }
    })

    if (permiso === false) {
      req.logger.warning("No has iniciado sesion")
      return res.status(403).json({ message: `no posee permisos, debes tener privilegios de : ${role}` })
    }
    next()
  }
}

export default authorization
