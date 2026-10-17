import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

const logAuthFailure = (operation, error) => {
    console.error(`Authentication ${operation} failed`, {
        error: error instanceof Error ? error.name : "UnknownError",
        mongooseReadyState: mongoose.connection.readyState
    })
}

export const signUp=async (req,res)=>{
try {
    const {name,email,password}=req.body

    const existEmail=await User.findOne({email})
    if(existEmail){
        return res.status(400).json({message:"email already exists !"})
    }
    if(password.length<6){
        return res.status(400).json({message:"password must be at least 6 characters !"})
    }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        name,password:hashedPassword,email
    })

    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
       maxAge:7*24*60*60*1000,
       sameSite:"None",
       secure:true
    })

    return res.status(201).json(user)

} catch (error) {
       logAuthFailure("signup", error)
       return res.status(500).json({message:"sign up failed"})
}
}

export const Login=async (req,res)=>{
try {
    const {email,password}=req.body

    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"email does not exists !"})
    }
   const isMatch=await bcrypt.compare(password,user.password)

   if(!isMatch){
   return res.status(400).json({message:"incorrect password"})
   }

    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
       maxAge:7*24*60*60*1000,
       sameSite:"None",
       secure:true
    })

    return res.status(200).json(user)

} catch (error) {
       logAuthFailure("signin", error)
       return res.status(500).json({message:"login failed"})
}
}

export const logOut=async (req,res)=>{
    try {
        res.clearCookie("token")
         return res.status(200).json({message:"log out successfully"})
    } catch (error) {
         return res.status(500).json({message:`logout error ${error}`})
    }
}
        