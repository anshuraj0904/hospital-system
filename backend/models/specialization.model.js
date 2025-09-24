import mongoose from "mongoose";


const specializationSchema = new mongoose.Schema({
    specialization: {type:String, required:true},
    doctors : [
        {type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
}, {timestamps:true})


export default mongoose.model("Specialization", specializationSchema)