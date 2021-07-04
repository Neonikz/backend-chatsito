const User = require('../models/user');
const Message = require('../models/message');


//Funcion que sincroniza al usuario conectado con la base de datos
const userConnected =  async( uid )  => {
    
    const user = await User.findById( uid );
    user.online = true;
    await user.save();

    return user;
}

//Funcion que sincroniza al usuario desconectado con la base de datos
const userDisconnected = async( uid ) => {
    const user = await User.findById( uid );
    user.online = false;
    await user.save();

    return user;
}

//Trae todos los usuarios de la base de dato y ordena a los que esten online primero
const getUsers = async() => {
    const users = await User
        .find()
        .sort('-online');
    return users;
}

//Grabas los mensajes recibidos en la BD
const recordMessage = async( payload ) => {

    try {
        
        const message = new Message( payload );
        await message.save();
        return message;

    } catch (error) {
        console.log(error);
        return false
    }

}

module.exports = {
    userConnected,
    userDisconnected,
    getUsers,
    recordMessage
}