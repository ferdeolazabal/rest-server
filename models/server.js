const express = require('express')
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');


const { dbConnection } = require('../database/config.db');


class Server{
        
    constructor(){
        this.app   = express();
        this.port  = process.env.PORT;
        
        
        this.paths = {
            auth       : '/api/auth',
            buscar     : '/api/buscar',
            categorias : '/api/categorias',
            usuarios   : '/api/usuarios',
            productos  : '/api/productos',
            uploads    : '/api/uploads',
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
        // Fileupload 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes(){

        this.app.use( this.paths.auth, require('../routes/auth.routes') );
        this.app.use( this.paths.buscar, require('../routes/buscar.routes') );
        this.app.use( this.paths.categorias, require('../routes/categorias.routes') );
        this.app.use( this.paths.productos, require('../routes/productos.routes') );
        this.app.use( this.paths.usuarios,require('../routes/usuarios.routes') );
        this.app.use( this.paths.uploads, require('../routes/uploads.routes') );
    };


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en http://localhost:${this.port}/`);
        });
    };
};


module.exports = Server;