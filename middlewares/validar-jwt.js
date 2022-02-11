const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            message: 'Token necesario'
        })
    };

    try {
        
        const secret = process.env.SECRET_OR_PRIVATE_KEY || 'secret';

        const { uid } = jwt.verify(token, secret );
        
        req.uid = uid;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        })
    }
    // console.log(token);

    next()

};


module.exports = {
    validarJWT
};