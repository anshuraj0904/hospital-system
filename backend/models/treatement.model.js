import mongoose from "mongoose";


const treatmentSchema = new mongoose.Schema({
    appointmentId :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"appointment"
    },

    statement : {type:String},
    prescription: [String]
})

export default mongoose.model("Treatment", treatmentSchema)