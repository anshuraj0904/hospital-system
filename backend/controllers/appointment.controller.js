import Appointment from "../models/appointment.model.js"


export const raiseIssue = async(req, res)=>{
    const {issue} = req.body

    if(!issue)
    {
        return res.status(400).json({
            message:"Please provide your issue!"
        });
    }

    try {

        if(req.user.role !== "patient")
        {
            return res.status(403).json({
                message:"Only a patient can raise an issue!"
            })
        }
        const newIssue = await Appointment.create({
            patientId: req.user.id,
            issue    
        }) 

        return res.status(201).json({
            message:"New Issue raised successfully!",
            data: newIssue
        });
    } catch (e) {
        console.error("Error raising the issue ", e);
        return res.status(500).json({
            message:"Error raising this new issue",
            error:e.message
        });
    }
}

export const assignSpecialist = async(req,res)=>{
    const {appointmentId} = req.params
    const {specialization} = req.body

    if(!specialization)
    {
         return res.status(400).json({
            message:"Please pass the specialization required!"
        });
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
            error:e.message
        });
    }
}


export const appointIssue = async(req,res)=>{
    const {doctorId, appointmentId} = req.params
    try {
        const appointment = await Appointment.findById(appointmentId)
        if(!appointment){
            return res.status(404).json({ message: "Appointment not found!" });
        }
        
        appointment.doctorId = doctorId
        appointment.isAssigned = true
        appointment.status = "in-progress"
        
        await appointment.save()

        return res.status(200).json({ message: "Doctor assigned successfully!", data: appointment });


    } catch (e) {
        console.error("Error assigning doctor:", e);
        return res.status(500).json({ message: "Failed to assign doctor", error: e.message });
    }
}

export const fetchOpenIssues = async(req,res)=>{
    try {
        const openAppointments = await Appointment.find({status:"open"}).sort({createdAt:-1, updatedAt:-1})
    
        return res.status(200).json({
                message:"Fetched all open appointments here!",
                data: openAppointments.length > 0 ? openAppointments:[]
            });
    } catch (e) {
        console.error("Error fetching appointments", e)
        return res.status(500).json({ message: "Failed to get all open appointments", error: e.message });

    }
}

export const fetchCancelledIssues = async(req,res)=>{
    try {
        const cancelledAppointments = await Appointment.find({status:"cancelled"})
        return res.status(200).json({
            message:"Fetched cancelled appointments!",
            data: cancelledAppointments.length >0 ? cancelledAppointments : []
        });

    } catch (e) {
        console.error("Error fetching the cancelled appointments", e)
        return res.status(500).json({message:"Failed to fetch cancelled appointments!", error:e.message});
    }
}

export const getMyAppointements = async(req, res)=>{
    try {
        const docId = req.user.id
        const appointments = await Appointment.find({status:"in-progress", doctorId:docId})
        
        return res.status(200).json({
            message:"Fetched appointments assigned to you",
            data: appointments.length >0 ? appointments : []
        });
    } catch (e) {
        console.error("Error fetching the open your appointments", e)
        return res.status(500).json({message:"Failed to fetch open appointments for you", error:e.message});
    }
}

export const cancelAppointment = async(req,res)=>{
    const {appointmentId} = req.params
    const userId = req.user.id
    try {
        const appointment = await Appointment.findById(appointmentId)
        if(!appointment)
        {
            return res.status(404).json({message:"Appointment not found!"});
        }

        if(appointment.status === "closed")
        {
            return res.status(401).json({message:"You cannot cancel a closed appointement!"});
        }
        
        if(appointment.doctorId.toString() !== userId)
        {
            return res.status(403).json({message:"You are not authorised to cancel this appointment!"});
        }

        appointment.status = "cancelled"
        appointment.doctorId = null
        await appointment.save()

        
        return res.status(200).json({
            message: "Appointment cancelled successfully",
            data: appointment
        });
    } catch (e) {
        console.error("Something went wrong while cancelling this appointment!", e)
        return res.status(500).json({message:"Something went wrong while cancelling this appointment!", error:e.message});
    }  
}


export const deleteAppointment = async(req,res)=>{
    const {appointmentId} = req.params
    const role = req.user.role
    const userId = req.user.id
    if(role === "doctor")
        {
            return res.status(403).json({
                message:"You are not authorized to do this!"
            });
        }
        
        try {
        const appointmentToDelete = await Appointment.findById(appointmentId)

        if(!appointmentToDelete)
        {
            return res.status(404).json({
                message:"Appointment not Found!"
            });
        }

        if(appointmentToDelete.status === "in-progress" || appointmentToDelete.status === "closed")
        {
            return res.status(409).json({
               message:"You cannot delete this appointment!"
            });
        }
        
        if(role === "admin"){

            if(appointmentToDelete.status === "open")
                {
                    return res.status(409).json({
                        message:"Not authorized to do this!"
                    });
                }
                else{
                     await appointmentToDelete.deleteOne()
              return res.status(200).json({message:"Cancelled appointment deleted by admin!"});
                }
        }

        if(role==="patient")
        {
            if(!["open", "cancelled"].includes(appointmentToDelete.status) || appointmentToDelete.patientId.toString() !== userId)
            {
                return res.status(403).json({message: "You can only delete your own open or cancelled appointments!"});
            }
            else{
                await appointmentToDelete.deleteOne()
                return res.status(200).json({
                    message:"Your appointment deleted successfully"
                });

            }
        }
    } catch (error) {
        console.error("Error deleting appointment:", error);
    return res.status(500).json({
      message: "Something went wrong while deleting this appointment",
      error: error.message
    });
    }
}