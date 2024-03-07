const mongoose = require("mongoose");

const connect = async()=>{
    try{
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("connected Database");

    }
    catch(error){
        console.log(error);
    }
    
}
module.exports=connect
