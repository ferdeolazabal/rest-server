const router = require('express').Router();
const { check } = require('express-validator');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoriaById,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias.controllers');

const { validateCategoriaById } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


// obtener todas als categorias - publico

router.get('/', obtenerCategorias );

// obtener categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( validateCategoriaById ), 
    validarCampos,
] , obtenerCategoriaById );

// crear categoria - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria );

// actualizar categoria - privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( validateCategoriaById ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarCategoria );

// borrar categoria - solo administrador
router.delete('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( validateCategoriaById ),
    validarJWT,
    esAdminRole,
    validarCampos,
], borrarCategoria );




module.exports = router;