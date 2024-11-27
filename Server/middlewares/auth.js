import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";



//Authentication

export const isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
  
    const {token} = req.cookies;
    if (!token) {
        return next(new ErrorHandler("User is Not Authenticated",400))
    }
    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)

    req.user = await User.findById(decode.id)
    next()
});

//Authorization

export const isAuthorized = (...roles)=>{
        return (req,res,next)=>{
            if (!roles.includes(req.user.role)) {
                 return next(new ErrorHandler(`User With This Role ${req.user.role} not allowed to access this resousrce`))
            } 

            next()
        }
}