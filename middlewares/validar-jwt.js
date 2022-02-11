const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            message: 'Token necesario'
        })
    };

    try {        
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY );

        const usuario = await Usuario.findById(uid);
    
        // verificar si el usuario tiene estado true (activo)
        if (!usuario || usuario.estado === false) {
            return res.status(401).json({
                ok: false,
                message: 'Usuario no existe en la base de datos o esta desactivado'
            });
        };
        
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        })
    };

};


module.exports = {
    validarJWT
};