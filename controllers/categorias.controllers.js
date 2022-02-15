const { response } = require("express");
const { Categoria } = require("../models");


// obtenerCategorias - paginado - total categorias - populate( ultimo usuario q modifico registro)

const obtenerCategorias = async (req, res= response) => {
    
    try {
        let { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
        limite = Number(limite);
        desde = Number(desde);
        const [ total, categorias] = await Promise.all([
            Categoria.countDocuments( query ),
            Categoria.find( query ).skip(desde).limit(limite).populate('usuario', 'nombre')
        ]);
        res.json({ total, categorias });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al obtener categorias'
        });
    }
};


// obtenerCategoriaById - populate { objeto de la categoria}

const obtenerCategoriaById = async (req, res= response) => {
    
    try {
        const { id } = req.params;
        const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    
        res.json({ categoria });
    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al obtener categoria'
        });
    }
};

const crearCategoria = async (req, res= response) => {

    try {
    
        const nombre = req.body.nombre.toUpperCase();

        const categoriaDB = await Categoria.findOne({ nombre });

        if ( categoriaDB ) {
            return res.status(400).json({
                ok: false,
                msg: `La categoria ${ categoriaDB.nombre } ya existe`
            });
        };

        // Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        };

        // Crear la categoria
        const categoria = new Categoria(data);

        // Guardar la categoria
        await categoria.save();

        res.status(201).json({
            ok: true,
            categoria
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }




}


// atualizarCatgoria - validar que exista la categoria - validar que el usuario sea el mismo que creo la categoria - validar que el nombre sea diferente al actual - validar que el nombre no exista en la base de datos - recibe el nombre

const actualizarCategoria = async (req, res= response) => {
    try {
        const { id } = req.params;
        // const { nombre } = req.body;

        const categoriaDB = await Categoria.findById(id);

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'La categoria no existe'
            });
        };

        // Validar que el usuario sea el mismo que creo la categoria
        if ( categoriaDB.usuario.toString() !== req.usuario._id.toString() ) {
            return res.status(400).json({
                ok: false,
                msg: 'No tienes permisos para actualizar esta categoria'
            });
        };

        // Validar que el nombre sea diferente al actual
        if ( categoriaDB.nombre.toUpperCase() === req.body.nombre.toUpperCase() ) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de la categoria no puede ser el mismo'
            });
        };

        // Generar la data a actualizar
        const data = {
            nombre: req.body.nombre.toUpperCase(),
            usuario: req.usuario._id
        };

        // Actualizar la categoria
        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.json({
            ok: true,
            msg: 'Categoria actualizada',
            categoria
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};


// borrarCategoria - validar que exista la categoria - validar que el usuario sea el mismo que creo la categoria - estado:false - recibe el id de la categoria

const borrarCategoria = async (req, res= response) => {
    try {
        const { id } = req.params;

        const categoriaDB = await Categoria.findById(id);

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'La categoria no existe'
            });
        };

        // Validar que el usuario sea el mismo que creo la categoria
        if ( categoriaDB.usuario.toString() !== req.usuario._id.toString() ) {
            return res.status(400).json({
                ok: false,
                msg: 'No tienes permisos para borrar esta categoria'
            });
        };

        // Generar la data a actualizar

        const data = {
            estado: false,
            usuario: req.usuario._id
        };

        // Actualizar la categoria
        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.json({
            ok: true,
            msg: 'Categoria borrada',
            categoria
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
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaById,
    actualizarCategoria,
    borrarCategoria
}