import { userModel } from "../models/user.models.js";

class UserDao {
  async getUsers() {
    return await userModel.find();
  }

  async getUserById(id) {
    return await userModel.findOne({ _id: id });
  }

  async getUserByEmail(email) {
    return await userModel.findOne({ email });
  }

  async createUser(data) {
    return await userModel.create(data);
  }

  async updateUser(id, data) {

    console.log('Actualizando informacion del Usuario')

    if (data.name) {
      console.log("Actualizando rol de usuario")
      await userModel.findOneAndUpdate(
        { _id: id },
        { $pull: { documents: { name: data.name } } },
        { new: true },
        async (err, userActualizado) => {
          if (err) {
            console.error(err);
          } else {
            const objetoExistente = userActualizado.documents.find(doc => doc.name === data.name);
            if (objetoExistente) {
              objetoExistente.reference = data.reference;
            } else {
              userActualizado.documents.push(data);
            }
            try {
              const resultado = await userActualizado.save();
              console.log(resultado);
            } catch (error) {
              console.error(error);
            }
          }
        }
      );
    } else {
      const adminUID = '6429686e7ea1c5f5b46d804b'
      await userModel.updateOne({
        $and: [
          {
            _id: id
          },
          {
            _id: { $nin: adminUID }
          }
        ]
      },
        { $set: data });
    }
  }
  async deleteUser(id) {
    return await userModel.deleteOne(
      {
        _id: id
      })
      .then(result => console.log(result))
      .catch(error => {
        throw new Error(error)
      })
  }

  async findInactiveUsers() {
    console.log("MONGO: Buscando usuarios inactivos")
    let requiredTime = new Date();
    requiredTime.setDate(requiredTime.getDate() - 2);
    const usuariosExcluidos = ['640dfe483d9a85c2cbdc44d6', '6429686e7ea1c5f5b46d804b', '644709cf130471ec9f3a268c'];
    const usuariosInactivos = await userModel.find(
      {
        $and: [
          { last_connection: { $lt: requiredTime } }, 
          { _id: { $nin: usuariosExcluidos } } 
        ]
      }, 'email -_id'
    );

    return usuariosInactivos;
  }


  async deleteInactiveUsers() {
    console.log("MONGO: Eliminando usuarios")
    let requiredTime = new Date()
    requiredTime.setDate(requiredTime.getDate() - 2)

    const usuariosExcluidos = ['640dfe483d9a85c2cbdc44d6', '6429686e7ea1c5f5b46d804b', '644709cf130471ec9f3a268c']
    userModel.deleteMany(
      {
        $and: [
          { last_connection: { $lt: requiredTime } },
          { _id: { $nin: usuariosExcluidos } } 
        ]
      }
    )
      .then(result => { 
        console.log(result)
      })
      .catch(error => {
        console.log(error)
      });
  }

  async getUserByToken(token) {
    try {
      return await userModel.find({ token: token },
        {
          password: 0, role: 0, username: 0, _v: 0, restoreToken: 0, age: 0, __v
            : 0
        }
      )
    } catch (error) {
      return error;
    }
  }
}

export default new UserDao()
