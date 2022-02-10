const router = require('express').Router();
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controllers');
const { validarCampos } = require('../middlewares/validar-campos');


router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],  login )




module.exports = router;