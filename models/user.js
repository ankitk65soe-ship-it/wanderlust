// User Model
// Defines the schema for user data in the application
// Uses passport-local-mongoose for authentication features

const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose").default;

// User schema definition
const userSchema=new Schema({
    email:{
        type:String,
        required:true,  // Email is mandatory for each user
    }
});

// Add passport-local-mongoose plugin which automatically adds username and password fields
// and provides authentication methods like register() and authenticate()
userSchema.plugin(passportlocalmongoose);

module.exports=mongoose.model("User",userSchema);

