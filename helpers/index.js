
const dbValidators = require('./db-validators');
const googleverify = require('./google-verify');
const generarJwt   = require('./jwt-generate');
const subirArchivo = require('./subir-archivo');




module.exports = {
    ...dbValidators,
    ...googleverify,
    ...generarJwt,
    ...subirArchivo
};