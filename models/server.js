const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();


class Server{
    
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 8080
        this.usuariosPath = '/api/usuarios'
        
        //Middlewares
        this.middlewares();

        //Routes
        this.routes();

    };

    middlewares(){
        //Permite que se puedan hacer peticiones desde cualquier origen
        this.app.use( cors() ); 
        //Muestra en consola las peticiones que se hacen al servidor
        this.app.use( morgan('dev') );
        //Lectura y parseo del body
        this.app.use( express.json() );     
        //Directorio publico
        this.app.use( express.static('public'));    
    }

    routes(){

        this.app.use(this.usuariosPath,require('../routes/usuarios.routes'));


    };


    listen() {
        this.app.listen(this.port, () => {
            console.log('Server is up on port', this.port);
        });
    };
};


module.exports = Server;