const { userConnected, userDisconnected, getUsers, recordMessage } = require("../controllers/sockets");
const { checkJWT } = require("../helpers/jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {

            //Check del token enviado al conectarse
            const [ valid, uid ] = checkJWT( socket.handshake.query['x-token'] );

            if( !valid ){
                return socket.disconnect();
            }

            await userConnected( uid );

            //Unir al user a una sala de socket.io
            socket.join( uid );
            

            //TODO: Validar el jwt
            //Si el token no es valido, desconectarlo

            //TODO: Saber que usuario esta activo mediante el UID

            //Emitir todos los usuarios conectados
            this.io.emit( 'user-list', await getUsers() );

            //Escuchar cuando el cliente manda un mensaje
            socket.on('personal-message', async( payload ) => {
                const message = await recordMessage( payload );
                this.io.to( payload.for ).emit('personal-message', message);
                this.io.to( payload.from ).emit('personal-message', message);
            });

            //Marca que el user se desconecto
            socket.on('disconnect', async () => {
                await userDisconnected( uid );
                this.io.emit( 'user-list', await getUsers() );
            });
        
        });
    }


}


module.exports = Sockets;