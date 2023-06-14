import config from '../config/config.js';
import mongoose from 'mongoose';


export let Users;
export let Sessions;
export let Products;
export let Carts;
export let Chat;
export let Ticket;


switch (config.persistence) {
  case 'MONGO':
    console.log('📝📝 Persistence from DB')
    mongoose.set('strictQuery', false)
    mongoose.connect(config.MONGO_URI, (error) => {
      console.log('🔌🔌🔌🔌 Connected to DB from factory')
      if (error) {
        console.log('Cannot connect to database' + error)
        process.exit()
      }
    })
    const { default: sessionsMongo } = await import('./mongo/sessions.mongo.js')
    const { default: productMongo } = await import('./mongo/products.mongo.js')
    const { default: cartMongo } = await import('./mongo/carts.mongo.js')
    const { default: chatMongo } = await import('./mongo/chat.mongo.js')
    const { default: ticketMongo } = await import('./mongo/ticket.mongo.js')
    const { default: usersMongo } = await import('./mongo/users.mongo.js')

    Users = usersMongo;
    Sessions = sessionsMongo;
    Products = productMongo;
    Carts = cartMongo;
    Chat = chatMongo;
    Ticket = ticketMongo;

    break;


  case 'MEMORY':


    const { default: usersMemory } = await import('./memory/users.memory.js')
    const { default: productMemory } = await import('./memory/products.memory.js')
    const { default: cartMemory } = await import('./memory/carts.memory.js')
    const { default: chatMemory } = await import('./memory/chat.memory.js')

    console.log("Persistence from memory")
    Users = usersMemory;
    Products = productMemory;
    Carts = cartMemory;
    Chat = chatMemory;


}
