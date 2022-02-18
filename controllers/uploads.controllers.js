const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( {cloudUrl: process.env.CLOUDINARY_URL} );
    // api_key: process.env.CLOUDINARY_KEY,
    // api_secret: process.env.CLOUDINARY_SECRET


const { response }          = require('express');
const { subirArchivo }      = require('../helpers');
const { Usuario, Producto } = require('../models');


const cargarArchivos = async (req, res = response, next) => {

    try {

        const archivo = await subirArchivo( req.files, undefined , 'imgs'  )
        
        res.json({
            ok: true,
            archivo
        });
    
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: error
        });
    }

};

const actualizarImagen = async ( req, res = response ) => {

    const { coleccion, id : idUsuario } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(idUsuario);
            if( !modelo ) {
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario con id '${ idUsuario }' no existe`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(idUsuario);
            if( !modelo ) {
                return res.status(400).json({
                    ok: false,
                    msg: `El producto con id '${ idUsuario }' no existe`
                });
            }
        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La colección no es válida'
            });
    }

    try {
        // lipiar imagenes previas
        if( modelo.img ) {
            // borrar imagen del servidor
            const pathImg = path.join(__dirname, `../uploads/`, coleccion, modelo.img);
            if( fs.existsSync( pathImg ) ) {
                fs.unlinkSync( pathImg );
            }
        }

    } catch (error) {
        console.log(error);
    }

    const archivo = await subirArchivo( req.files, undefined , coleccion )
        
    modelo.img = archivo.nombreArchivo; 

    await modelo.save();


    res.json( {
        ok: true,
        msg: 'Imagen actualizada',
        modelo
    })

};


const actualizarImagenCloudinary = async ( req, res = response ) => {

    const { coleccion, id : idUsuario } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(idUsuario);
            if( !modelo ) {
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario con id '${ idUsuario }' no existe`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(idUsuario);
            if( !modelo ) {
                return res.status(400).json({
                    ok: false,
                    msg: `El producto con id '${ idUsuario }' no existe`
                });
            }
        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La colección no es válida'
            });
    }

    try {
        // limpiar imagenes previas
        if( modelo.img ) {
            // borrar imagen del servidor
            const url  = modelo.img.split('/');
            const img = url[ url.length - 1 ];
            const [ public_id ] = img.split('.');
            cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        
        modelo.img = secure_url;

        await modelo.save();

        res.json( {
            ok: true,
            msg: 'Imagen actualizada',
            modelo
        })

    } catch (error) {
        console.log(error);
    };
};

// const mostrarImagen = async ( req, res = response ) => {

//     const { coleccion, id : idUsuario } = req.params;

//     let modelo;

//     switch ( coleccion ) {
//         case 'usuarios':
//             modelo = await Usuario.findById(idUsuario);
//             if( !modelo ) {
//                 return res.status(400).json({
//                     ok: false,
//                     msg: `El usuario con id '${ idUsuario }' no existe`
//                 });
//             }
//         break;

//         case 'productos':
//             modelo = await Producto.findById(idUsuario);
//             if( !modelo ) {
//                 return res.status(400).json({
//                     ok: false,
//                     msg: `El producto con id '${ idUsuario }' no existe`
//                 });
//             }
//         break;

//         default:
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'La colección no es válida'
//             });
//     }

//     try {
//         // limpiar imagenes previas
//         if( modelo.img ) {
//             // borrar imagen del servidor
//             const pathImg = path.join(__dirname, `../uploads/`, coleccion, modelo.img);
//             if( fs.existsSync( pathImg ) ) {
//                 res.sendFile( pathImg );
//             }
//         } else {
//             // defaul img
//             const noImage = path.join(__dirname, '../assets/no-image.jpg');
//             return res.sendFile( noImage );
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

module.exports = { 
    cargarArchivos,
    actualizarImagen,
    // mostrarImagen,
    actualizarImagenCloudinary
};