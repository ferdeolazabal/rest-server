const { Categoria,
        Usuario,
        Role,
        } = require('../models');
// const Role = require('../models/role');
// const Usuario = require('../models/usuario');

const validateRol = async( rol = '' ) => {
    const validateRol = await Role.findOne({ rol });
    if ( !validateRol ) {
        throw new Error(`El rol '${rol}' no está registrado en DB`);
    }
};

const validateMail = async( correo = '' ) => {
    const existeMail = await Usuario.findOne({ correo });
    if ( existeMail ) {
        throw new Error(`El correo '${correo}' ya está registrado en DB`);
    } 
};

const validateUserByID = async( id = '' ) => {
    const validateUser = await Usuario.findById(id);
    if ( !validateUser ) {
        throw new Error(`El usuario con id '${id}' no está registrado en DB`);
    }

};

// middleware que verifique id por params que exista que se llame existe categoria, similar a validateUserByID

const validateCategoriaById = async( id = '' ) => {
    const validateCategoria = await Categoria.findById(id);
    if ( !validateCategoria ) {
        throw new Error(`La categoria con id '${id}' no está registrado en DB`);
    }
}



module.exports = {
    validateRol,
    validateMail,
    validateUserByID,
    validateCategoriaById
};