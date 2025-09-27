import Feedback from "../models/feedback.model.js";
import Treatment from "../models/treatment.model.js";
import Appointment from "../models/appointment.model.js";
import User from "../models/users.model.js";

export const giveFeedback = async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "patient") {
    return res
      .status(403)
      .json({ message: "You are not authorised to access this!" });
  }
  const userId = req.user.id;
  const { treatmentId } = req.params;
  const { feedbackStatement, reportToAdmin } = req.body;

  if (!feedbackStatement || reportToAdmin === undefined) {
    return res.status(401).json({ message: "Please pass in all the values!" });
  }

  try {
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) {
      return res
        .status(404)
        .json({ message: "No such prescription found for giving a feedback!" });
    }

    if (treatment.paymentStatus === "yet to pay") {
      return res
        .status(401)
        .json({
          message: "Please pay the amount and access the prescription!",
        });
    }

    const appointment = await Appointment.findById(treatment.appointmentId);
    if (!appointment || appointment.patientId.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "You are not authorised to give feedback for this one!",
        });
    }
    const newFeedack = await Feedback.create({
      treatmentId:treatmentId,  
      feedbackStatement:feedbackStatement,
      reportToAdmin:reportToAdmin,
      patientId:appointment.patientId
    });

    return res.status(201).json({
        message:`Feedback created successfully for the Treatment number:  ${treatmentId}`,
        data: newFeedack
    })
  } catch (e) {
    console.error("Some error in creating the feedback", e.message)
    return res.status(500).json({
        message:"Some error in creating the feedback",
        error:e.message
    })
  }
};


export const issueWarning = async(req,res)=>{
    const userRole = req.user.role
    const {feedbackId} = req.params

    if(userRole !== "admin")
        {
            return res.status(403).json({
                message:"You are not authorised to perform this action!"
            })
        }
    try {
        const feedback = await Feedback.findById(feedbackId)
    
        if(!feedback)
        {
            return res.status(404).json({
                message:"No such feedback there!"
            })
        }

        if(feedback.reportToAdmin)
        {
            const treatment = await Treatment.findById(feedback.treatmentId)
            const user = await User.findById(treatment.createdBy)
            user.warnings += 1;

            if(user.warnings >= 5)
            {
                user.isBlocked = true
            }
            await user.save()

            return res.status(200).json({
                message:user.isBlocked ? "Warning issued and doctor has been block from practising until further notice" : "Warning issued to the doctor"
            })
        }
    } catch (e) {
        console.error("Some error occured while performing this task!", e.message)
        return res.status(500).json({
            message:"Some error occured while performing this task!",
            error:e.message
        })
    }
}