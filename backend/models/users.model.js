import mongoose from "mongoose";


const userSchema =  new mongoose.Schema({
    email : {type:String, required: true, unique: true},
    password: {type:String, required: true},
    name: String,
    role: {type: String, default:"user", enum:["patient", "doctor", "admin"]},
    specialization:[String],
    status: { type: String, enum: ["available", "on-leave"], default: "available" },
    warnings: { type: Number, default: 0 },  
    isBlocked: { type: Boolean, default: false }
}, {timestamps:true})


export default mongoose.model("User", userSchema)