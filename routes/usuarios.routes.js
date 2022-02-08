const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios.controllers');

const router = Router();

router.get('/', usuariosGet );

router.post('/', usuariosPost );

router.put('/:id', usuariosPut );

router.delete('/', usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;