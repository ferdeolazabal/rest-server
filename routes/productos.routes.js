const router = require('express').Router();
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { validateCategoriaById, validateProductoById } = require('../helpers/db-validators');

const {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    borrarProducto } = require('../controllers/productos.controllers');


// Ruta para obtener todos los productos
router.get('/', obtenerProductos );

// Ruta para obtener un producto por id
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( validateProductoById ), 
    validarCampos,
] , obtenerProductoById );

// Ruta para crear un producto
router.post('/', [ // el usuario esta en el token
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un Id de Mongo válido').isMongoId(),
    check('categoria').custom( validateCategoriaById ), 
    validarCampos,
],crearProducto );

// actualizar producto - privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( validateProductoById  ),
    validarCampos,
], actualizarProducto );

// borrar categoria - solo administrador
router.delete('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( validateProductoById ),
    validarJWT,
    esAdminRole,
    validarCampos,
], borrarProducto );


module.exports = router
