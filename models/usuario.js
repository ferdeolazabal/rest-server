const { Schema, model } = require('mongoose');


const UsuariosSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    correo: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        // default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// UsuariosSchema.method('toJSON', function() {
//     const { __v, password, ...user } = this.toObject();
//     return user;
// });

UsuariosSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
};


module.exports = model( 'Usuario', UsuariosSchema );