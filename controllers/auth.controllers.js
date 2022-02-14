const { response } = require('express');
const bcrypt       = require('bcryptjs');
const Usuario      = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt-generate');
const { googleverify } = require('../helpers/google-verify');

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

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleverify( id_token )

        // Check if user exists
        let usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            // Create new user
            usuario = new Usuario({
                nombre,
                correo,
                img,
                password: ':)',
                google: true
            });
        } else {
            // Update user
            usuario.nombre = nombre;
            usuario.img = img;
            usuario.google = true;
        }
        // Save user
        await usuario.save();

        // if usuario en db esta bloqueado
        if( !usuario.estado ) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario bloqueado, hable con el administrador'
            });
        };

        // Generate JWT
        const token = await generarJwt( usuario.id );


        res.json({
            ok: true,
            msg: 'Sign in by Google ok!',
            usuario, token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Google token no es valido'
        });
    };

};


module.exports = {
    login,
    googleSignIn
};
