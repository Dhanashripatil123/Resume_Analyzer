const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
      type : String,
       unique : [true , "usrname is already taken"],
       required : true,                                           
    } ,
    
    email:{
     type:String,
     unique:[true,"Account alrady exists with this email address"],
     required: true,                                            
    },

    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel