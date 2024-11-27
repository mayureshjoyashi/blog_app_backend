import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name Must Contain At least 3 Charachter"],
    maxLength: [32, "Name Must Contain At least 32 Charachter"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please Provide Valid Email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password Must Contain At least 8 Charachter"],
    maxLength: [32, "Password Cannot exceed 32 Charachter"],
    select:false
  },
  role: {
    type: String,
    required: true,
    enum: ["Reader", "Author"],
  },
  phone: {
    type: Number,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required:true
    },
    url:{
      type:String,
      required:true
    },
  },
  education: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save',async function(){
  if (!this.isModified("password")) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}


UserSchema.methods.getJWTtoken =  function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{
      expiresIn: process.env.JWT_EXPIRES,
    })
}



export const User = mongoose.model("User", UserSchema);
