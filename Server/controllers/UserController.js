import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary"


export const register = catchAsyncErrors(async (req,res,next)=>{
         
      if (!req.files || Object.keys(req.files).length === 0) {
          return next(new ErrorHandler("User Avatar Required",400))
      }
   const {avatar} = req.files;

   const allowedFormats = ["image/png","image/jpeg","image/webp"]
    if (!allowedFormats.includes(avatar.mimetype)) {
      return next(new ErrorHandler("Invalid File Type ,Please Provide Your Avatar in png ,jpeg ,webp format ",400))

    }
         const {name,email,phone,role,education,password} = req.body
         if (!name || !email || !phone || !role || !education || !password || !avatar) {
                  return next(new ErrorHandler("Please Provide Full Deatils",400))
         }
         let userexist = await User.findOne({email})
         if (userexist) {
            return next(new ErrorHandler("User already Exist",400))
         }

         const cloudninaryResponse = await cloudinary.uploader.upload(
          avatar.tempFilePath
         );
         if (!cloudninaryResponse || cloudninaryResponse.error) {
              console.log("Cloudninary Error:",cloudninaryResponse.error || "Unknown Cloudninary Error");
         }
       userexist =   await User.create({
           name,email,phone,role,education,password,avatar:{public_id: cloudninaryResponse.public_id, url:cloudninaryResponse.secure_url}
         });
         sendToken(userexist,200, "User Registered Successfully",res)
      
     
})

export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email, password, role} = req.body

    if (!email || !password || !role) {
       return next(new ErrorHandler("Please Provide Full Credentials ",400))
    }

    const user = await User.findOne({email}).select("+password")
    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password ",400))
    }
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Email or Password",400))
    }
    if (user.role !== role) {
      return next(new ErrorHandler(`User Provided Role ${role} not found`,400))
    }
    sendToken(user,200, "User Login Successfully",res)
    

    
})

export const logout = catchAsyncErrors((req, res, next) => {
  res.status(200).cookie("token", "", {
    expires: new Date(0), // Set expiration date to a date in the past
    httpOnly: true,
  })
  .json({
    success: true,
    message: "User Logged out Successfully"
  });
});


export const getMyProfile = catchAsyncErrors((req,res,next)=>{


  const user = req.user;
  res.status(200).json({
    success:true,
    user
  })
})

export const getAllauthors = catchAsyncErrors(async(req,res,next)=>{
       
  const authors = await User.find({role:"Author"})
  res.status(200).json({
    success:true,
    authors
  })


})
