const { response } = require("express");


const esAdminRole = ( req, res = response, next ) => {

    const usuario = req.usuario;

    if ( !usuario ){
        return res.status(401).json({
            ok: false,
            message: 'Usuario no autenticado'
        });
    }

    if ( usuario.rol === 'ADMIN_ROLE' ) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: ` ${ usuario.nombre } no tiene permiso para realizar esta acción`
        });
    };

};

const tieneRole = ( ...roles ) => {
    
    return ( req, res = response, next ) => {

        if( !req.usuario) {
            return res.status(401).json({
                ok: false,
                message: 'Usuario no autenticado'
            });
        }

        if ( !roles.includes( req.usuario.rol ) ){
            return res.status(401).json({
                ok: false,
                message: ` El servicio requiere uno de estos roles: ${ roles }...`
            });
        }

        next();

    }
};



module.exports = {
    esAdminRole,
    tieneRole
}