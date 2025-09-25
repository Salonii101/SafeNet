const mongoose = require('mongoose') ;
const dotenv = require('dotenv') ;
const app = require('./app') ;


dotenv.config() ;


console.log("Dev Environment") ;

mongoose.connect(process.env.MONGODB_CONNECTION_URI).then(() => {
    console.log("MongoDB Connected") ;
    app.listen( process.env.PORT || 3300 , () => {
        console.log("Everything running Perfectly") ;
    }) ;
}).catch((err) => {
    console.error(err.message) ;
}) ;


