const jwt          = require('jsonwebtoken');


const generarJwt = ( uid = '' ) =>{

    return new Promise( ( resolve, reject ) => {

        const payload = { uid };
        const secret = process.env.SECRET_OR_PRIVATE_KEY || 'secret';
        const expiresIn = '4h';

        
        jwt.sign( payload, secret, { expiresIn },
            ( err, token ) => {
                if( err ) {
                    console.log(err);
                    reject('Error inesperado, no se generó el token');
                } else {
                    resolve( token );
                }
            }
        );
    });

};

module.exports = {
    generarJwt
};