import Appointment from "../models/appointment.model.js"


export const raiseIssue = async(req, res)=>{
    const {issue} = req.body

    if(!issue)
    {
        return res.status(400).json({
            message:"Please provide your issue!"
        })
    }

    try {
        const newIssue = await Appointment.create({
            patientId: req.user.id,
            issue    
        }) 

        return res.status(201).json({
            message:"New Issue raised successfully!",
            data: newIssue
        })
    } catch (e) {
        console.error("Error raising the issue ", e);
        return res.status(500).json({
            message:"Error raising this new issue",
            data:e.message
        })
    }
}

export const assignSpecialization = async(req,res)=>{
    const {appointmentId} = req.params
    const {specialization} = req.body

    if(!specialization)
    {
         return res.status(400).json({
            message:"Please give the specialization!"
        })
    }

    try {
        const appointment = await Appointment.findById(appointmentId)
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found!"
            });
        }
        
        appointment.specialization = specialization

        await appointment.save()
    } catch (e) {
        console.error("Error assigning the specialization", e)
        return res.status(500).json({
            message:"Error assiging the specialization",
            data:e.message
        })
    }
}


export const appointIssue = async(req,res)=>{
    const {doctorId, appointmentId} = req.params
    try {
        const appointment = await Appointment.findById(appointmentId)
        if(!appointment){
            return res.status(404).json({ message: "Appointment not found!" })
        }
        
        appointment.doctorId = doctorId
        appointment.isAssigned = true
        appointment.status = "in-progress"
        
        await appointment.save()

        return res.status(200).json({ message: "Doctor assigned successfully!", data: appointment });


    } catch (e) {
        console.error("Error assigning doctor:", e);
        return res.status(500).json({ message: "Failed to assign doctor", details: e.message });
    }
}

export const fetchOpenIssues = async(req,res)=>{
    try {
        const openAppointments = await Appointment.find({status:"open"})
    
        return res.status(200).json({
                message:"Fetched all open appointments here!",
                data: openAppointments.length > 0 ? openAppointments:[]
            })
    } catch (e) {
        console.error("Error fetching appointments", e)
        return res.status(500).json({ message: "Failed to get all open appointments", details: e.message });

    }
}

export const getMyAppointements = async(req, res)=>{
    try {
        const docId = req.user.id
        const appointments = await Appointment.find({status:"in-progress", doctorId:docId})
        
        return res.status(200).json({
            message:"Fetched open appointments assigned to you",
            data: appointments.length >0 ? appointments : []
        })
    } catch (e) {
        console.error("Error fetching the open your appointments", e)
        return res.status(500).json({message:"Failed to fetch open appointments for you", data:e.message})
    }
} 