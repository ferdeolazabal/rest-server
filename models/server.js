const express = require('express')
const morgan = require('morgan');
const cors = require('cors');


const { dbConnection } = require('../database/config.db');


class Server{
        
    constructor(){
        this.app   = express();
        this.port  = process.env.PORT;
        
        
        this.paths = {
            auth       : '/api/auth',
            categorias : '/api/categorias',
            usuarios   : '/api/usuarios',
            productos  : '/api/productos',
        };

        //Conectar a dbConnection
        this.connectDb();
        //Middlewares
        this.middlewares();
        //Routes
        this.routes();

    };

    async connectDb() {
        await dbConnection();
    }

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

        this.app.use( this.paths.auth, require('../routes/auth.routes') );
        this.app.use( this.paths.usuarios,require('../routes/usuarios.routes') );
        this.app.use( this.paths.categorias, require('../routes/categorias.routes') );
        this.app.use( this.paths.productos, require('../routes/productos.routes') );
    };


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en http://localhost:${this.port}/`);
        });
    };
};


module.exports = Server;