const router = require('express').Router();
const { check } = require('express-validator');

const { cargarArchivos,
        // actualizarImagen, 
        // mostrarImagen,
        actualizarImagenCloudinary} = require('../controllers/uploads.controllers');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivo } = require('../middlewares');


router.post('/', validarArchivo , cargarArchivos );

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id es obligatorio').isMongoId(),
    check('coleccion', 'La colección es obligatoria').custom( validador => coleccionesPermitidas( validador, [ 'usuarios', 'productos' ] ) ),
    validarCampos
], actualizarImagenCloudinary );
// ] , actualizarImagen );


// only for testing localServer
// router.get('/:coleccion/:id', [
//     check('id', 'El id es obligatorio').isMongoId(),
//     check('coleccion', 'La colección es obligatoria').custom( validador => coleccionesPermitidas( validador, [ 'usuarios', 'productos' ] ) ),
//     validarCampos
// ], mostrarImagen )


module.exports = router;