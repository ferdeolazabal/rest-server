const { response, request } = require('express')
const { Producto } = require("../models");


// obtenerProductos - paginado - total categorias - populate( ultimo usuario q modifico registro)
const obtenerProductos = async (req, res = response) => {
    
    try {
        let { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };

        const [ total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip( Number(desde) )
                .limit( Number(limite) )
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
                
        ]);

        res.json({ total, productos });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al obtener productos'
        });
    }
};

// obtenerProductoById - populate { objeto de la categoria}
const obtenerProductoById = async (req, res = response) => {

    try {
        const { id } = req.params;
        const producto = await Producto.findById(id)
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

        res.json({ producto });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al obtener producto'
        });
    }
};

// crearProducto - privado - cualquier persona con token valido
const crearProducto = async (req, res = response) => {

    try{
        // saco lo q no necesito con la desestructuracion..
        const { nombre, usuario, estado, ...body } = req.body;

        const productoDB = await Producto.findOne({ nombre });

        if (productoDB) {
            return res.status(400).json({
                ok: false,
                msg: `El producto ${ productoDB.nombre } ya existe`
            });
        }

        // generar data a guardar
        const data = {
            ...body,
            nombre: req.body.nombre.toUpperCase(),
            usuario: req.usuario._id,
        }

        // crear producto
        const producto = new Producto(data);
        
        // guardar en la base de datos
        await producto.save();

        res.status(201).json({
            ok: true,
            msg: 'Producto creado',
            producto
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al crear producto'
        });
    }

};  


const actualizarProducto = async (req, res = response) => {

    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        if( data.nombre ){
            data.nombre = data.nombre.toUpperCase();
        }

        data.usuario = req.usuario._id;

        // Actualizar la categoria
        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.json({
            ok: true,
            msg: 'Producto actualizado',
            producto
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}

const borrarProducto = async (req, res = response) => {

    try {
        const { id } = req.params;

        const producto = await Producto.findByIdAndUpdate(id, { estado:false }, { new: true });

        res.json({
            ok: true,
            msg: 'Categoria borrada',
            producto
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};



module.exports = {
    obtenerProductos,
    obtenerProductoById,
    crearProducto,
    actualizarProducto,
    borrarProducto
}
