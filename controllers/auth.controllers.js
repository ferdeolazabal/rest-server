const { response } = require('express');
const bcrypt       = require('bcryptjs');
const Usuario      = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt-generate');

const login = async ( req, res = response ) => {

    const { correo, password } = req.body;

    try {

        // Validate email and password
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid email or password - correo'
            });
        };
        // check if password is correct
        const validPassword = await bcrypt.compare( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid email or password - password'
            });
        };
        // check if user is active
        if( !usuario.estado ) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid email or password || User is not active'
            });
        };
        
        // generar JWT
        const token = await generarJwt( usuario.id );
        

        res.json({
            ok: true,
            msg: 'Login correcto',
            usuario, token
        });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    };  
};


module.exports = {
    login
};
