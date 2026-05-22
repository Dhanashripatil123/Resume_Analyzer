const mongoose = require("mongoose")

async function connectTOB(){
   try{
        await mongoose.connect(process.env.MONGO_URL)
    
    console.log("connected to Dtabase")
   }
   catch(err){
     console.log(err)
   } 
}

module.exports = connectTOB