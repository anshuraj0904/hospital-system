import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    prescription: [String],
    billAmount: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // doctor
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["yet to pay", "paid"],
        default: "yet to pay"
    }
}, { timestamps: true });

export default mongoose.model("Treatment", treatmentSchema);
