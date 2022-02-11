const router = require('express').Router();
const { check } = require('express-validator');

const { validarCampos,
        validarJWT,
        esAdminRole, 
        tieneRole } = require('../middlewares');

const { validateRol, 
        validateMail, 
        validateUserByID } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios.controllers');


router.get('/', usuariosGet );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 letras').isLength({ min:6 }),
    check('correo', 'el correo no es válido').isEmail(),
    check('correo').custom( validateMail ),
    check('rol').custom( validateRol ),
    validarCampos
], usuariosPost );

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( validateUserByID ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 letras').isLength({ min:6 }),
    check('rol').custom( validateRol ), 
    validarCampos
] ,usuariosPut );

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( validateUserByID ),
    validarCampos
] ,usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;