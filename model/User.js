const mongoose=require("mongoose");
const { use } = require("passport");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose")
const userSchema=new Schema({
    email:{
        type:String,required:true
    },
    
    
})
//Username and password will be automatically added by the passsport local-mongoose library
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema)