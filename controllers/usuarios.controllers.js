const { response, request } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');



const usuariosGet = async (req = request, res = response) => {

    try {

        let { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
        limite = Number(limite);
        desde = Number(desde);

        const [ total, usuarios] = await Promise.all([
            Usuario.countDocuments( query ),
            Usuario.find( query ).skip(desde).limit(limite)
        ]);

        res.json({ total, usuarios });
    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuarios'
        });
    }
};

const usuariosPost = async (req = request, res = response) => {
    
    try {

        const { nombre, correo, password, rol} = req.body;
        const usuario = new Usuario( { nombre, correo, password, rol } );
        
        // hashear password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        // guardar usuario
        await usuario.save();
        res.json({ usuario, ok: true, message: 'Usuario creado' });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al crear usuario',
            error
        });
    };
};

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params;
    // se desestructura lo q no se manda en el obj resto.. 
    const { _id, password, google, ...resto } = req.body;

    try {
        
        if( password ) {
            const salt = bcrypt.genSaltSync();
            resto.password = bcrypt.hashSync(password, salt);
        }

        const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

        res.json({
            ok: true,
            message: 'Usuario actualizado',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al actualizar usuario',
            error
        });
    };

};


const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    const uid  = req.uid

    // borrar fisicamente de la DB
    // const usuario = await Usuario.findByIdAndDelete( id )

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.json({
        ok: true,
        message: 'Usuario eliminado',
        usuario, uid
    });
};

const usuariosPatch = (req = request, res = response) => {
    res.json({
        message: 'Patch API - Controlador'
    });
};




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}