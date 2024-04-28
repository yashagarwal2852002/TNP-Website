const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
    }catch(error){
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;