const mongoose = require('mongoose');
const colors = require('colors');


const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });

        console.log('DB connection successful'.bgGreen.black);

        
    } catch (error) {
        console.log(error);
        throw new Error('DB connection error!'.bgRed.black);
    }


}



module.exports = {
    dbConnection
}
