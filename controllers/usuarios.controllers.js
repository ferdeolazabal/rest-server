const { response } = require('express')



const usuariosGet = (req, res = response) => {

    const { q, nombre='not sent', api } = req.query;

    res.json({
        message: 'Get API - Controlador',
        q, nombre, api
    });
};

const usuariosPost = (req, res = response) => {
    const { name, edad } = req.body;
    res.json({
        message: 'Post API - Controlador',
        name, edad
    });
};

const usuariosPut = (req, res = response) => {
    const { id } = req.params
    res.json({
        message: 'Put API - Controlador',
        id
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        message: 'Delete API - Controlador'
    });
};

const usuariosPatch = (req, res = response) => {
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