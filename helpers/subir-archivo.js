const { v4: uuidv4 } = require('uuid');
const path = require('path');


const subirArchivo = ( files, extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {
        
        const { archivo } = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];


        if ( !extencionesValidas.includes(extension) ) {
            return reject(`La extención '${ extension }' no es válida. ( Extensiones válidas: ${ extencionesValidas.join(', ') } )`);
        };

        const nombreArchivo = `${ uuidv4() }.${ extension }`;
        const uploadPath = path.join( __dirname , '../uploads/', carpeta,  nombreArchivo );

        const staticPath = `../uploads/${ carpeta }/${ nombreArchivo }`;

        archivo.mv(uploadPath, (err) => {
            if (err) return reject(err);

            resolve( {nombreArchivo, staticPath } );
        });
    })
};






module.exports = {
    subirArchivo,
};