const { response } = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;


const coleccionesPermitidas = [
    'usuarios', 
    'categorias', 
    'productos', 
    'roles'
];


const buscarUsuarios = async( termino='', res = response ) => {

    const esMongoId = ObjectId.isValid( termino ); //true

    if ( esMongoId ) {
            
        const usuario = await Usuario.findById( termino );

        return res.json({
            ok: true,
            msg: 'Busqueda por usuarios',
            resultados: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' )

    const parametros = {
        $or: [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]
    }

    const usuarios = await Usuario.find( parametros );
    const usuariosCant = await Usuario.count( parametros );

    res.json({
        ok: true,
        msg: 'Busqueda por usuarios',
        count: usuariosCant,
        resultados: usuarios
    });

}

const buscarCategorias = async( termino='', res = response ) => {

    const esMongoId = ObjectId.isValid( termino ); //true

    if ( esMongoId ) {
            
        const categoria = await Categoria.findById( termino );

        return res.json({
            ok: true,
            msg: 'Busqueda por categorias',
            resultados: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' )

    const parametros = {
        $or: [ { nombre: regex } ],
        $and: [ { estado: true } ]
    }

    const categorias = await Categoria.find( parametros );
    const categoriasCant = await Categoria.count( parametros );

    res.json({
        ok: true,
        msg: 'Busqueda por categorias',
        count: categoriasCant,
        resultados: categorias
    });


}

const buscarProductos = async( termino='', res = response ) => {

    const esMongoId = ObjectId.isValid( termino ); //true

    if ( esMongoId ) {
            
        const producto = await Producto.findById( termino )
                                .populate('categoria','nombre')
                                .populate('usuario','nombre');

        return res.json({
            ok: true,
            msg: 'Busqueda por productos',
            resultados: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' )

    const parametros = {
        $or: [ { nombre: regex } ],
        $and: [ { estado: true } ]
    }

    const productos = await Producto.find( parametros )
                            .populate('categoria','nombre')
                            .populate('usuario','nombre');
    
    const productosCant = await Producto.count( parametros );

    res.json({
        ok: true,
        msg: 'Busqueda por productos',
        count: productosCant,
        resultados: productos
    });


}

const buscar = ( req, res = response ) => {

    let { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).json({
            ok: false,
            msg: 'Coleccion no permitida',
            errors: { message: `Las colecciones permitidas son: ${coleccionesPermitidas}` }
        });
    }

    switch( coleccion ){
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;
        case 'categorias':
            buscarCategorias( termino, res );
        break;
        case 'productos':
            buscarProductos( termino, res );
        break;
        // case 'roles':
            // return res.json({
            //     ok: true,
            //     msg: 'Busqueda por roles',
            //     resultados: coleccion
            // });
        default:
            res.status(400).json({
                ok: false,
                msg: 'Coleccion no encontrada',
                errors: { message: `Las colecciones permitidas son: ${coleccionesPermitidas}` }
            });
    }

}


    // coleccion = coleccion.charAt(0).toUpperCase() + coleccion.slice(1);

    // const Model = require(`../models/${coleccion}.model`);

    // Model.find({ [`${coleccion}`]: { $regex: termino, $options: 'i' } })

    //     .exec( ( err, result ) => {

    //         if( err ){
    //             return res.status(500).json({
    //                 ok: false,
    //                 msg: 'Error al buscar',
    //                 errors: err
    //             });
    //         }

    //         res.status(200).json({
    //             ok: true,
    //             [coleccion]: result
    //         });

    //     });


module.exports = {
    buscar
};