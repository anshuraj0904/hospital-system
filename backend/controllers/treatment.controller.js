import Appointment from "../models/appointment.model.js";
import Treatment from "../models/treatment.model.js";

export const createTreatment = async (req, res) => {
  const userId = req.user.userId;
  const userRole = req.user.userRole;
  const { appointmentId } = req.params;
  const { statement, prescription, billAmount } = req.body;

  if (userRole !== "doctor") {
    return res.status(403).json({
      message: "You are not authorized to do this!",
    });
  }

  if (!statement || !prescription || !billAmount) {
    return res.status(400).json({
      message: "Please provide all the details!",
    });
  }

  if (!Array.isArray(prescription)) {
    return res.status(400).json({
      message: "Provide the prescription in the form of an array!",
    });
  }

  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorId: userId,
    });
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment does not exist!",
      });
    }

    const newTreatment = await Treatment.create({
      appointmentId: appointmentId,
      statement,
      prescription,
      billAmount,
      paymentStatus: "yet to pay",
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Treatment created successfully!",
      data: newTreatment,
    });
  } catch (error) {
    console.error("Error creating treatment:", error);
    return res.status(500).json({
      message: "Something went wrong while creating treatment",
      error: error.message,
    });
  }
};

export const makePayment = async (req, res) => {
  const { treatmentId } = req.params;
  const userRole = req.user.role;
  const userId = req.user.id;

  if (userRole !== "patient") {
    return res.status(403).json({
      message: "You are not authorised for this section!",
    });
  }

  try {
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) {
      return res.status(404).json({
        message: "No such treatment!",
      });
    }

    const appointement = await Appointment.findById(treatment.appointmentId);
    if (userId !== appointement.patientId.toString()) {
      return res.status(409).json({
        message: "You cannot make payment for someone else's treatment!",
      });
    }

    treatment.paymentStatus = "paid";
    await treatment.save();

    return res.status(200).json({
      message: "Payment successfull! You can aceess you prescription now!",
    });
  } catch (e) {
    console.error("Some issues while doing the payment!", e.message);
    return res.status(500).json({
      message: "Some issues while doing the payment!",
      error: e.message,
    });
  }
};

export const getOneTreatment = async (req, res) => {
  const { treatmentId } = req.params;
  const userRole = req.user.role;

  try {
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) {
      return res.status(404).json({ message: "Prescription not found!" });
    } else {
      if (userRole === "patient") {
        const appointement = await Appointment.findById(
          treatment.appointmentId
        );
        if (appointement.patientId !== req.user.id) {
          return res
            .status(403)
            .json({ message: "You can only see your own prescription!" });
        } else {
          if (treatment.paymentStatus === "yet to pay") {
            return res
              .status(403)
              .json({
                message: "You can only see the prescription after the payment!",
              });
          } else {
            // Isko we'll see ki kaise change karna hai.
            const prescriptionForPatient = await treatment
              .findById(treatmentId)
              .select("-createdBy -payementStatus");
            return res.status(200).json({
              message: "Fetched the prescription succefully!",
              data: prescriptionForPatient,
            });
          }
        }
      } else if (userRole === "doctor") {
        if (treatment.createdBy !== req.user.id) {
          return res
            .status(403)
            .json({ message: "You are not authorised to see this!" });
        } else {
          const prescriptionForDoctor = await Treatment.findById(
            treatmentId
          ).select("-createdBy");
          return res.status(200).json({
            message: "Fetched the detail of the treatment!",
            data: prescriptionForDoctor,
          });
        }
      } else {
        return res.status(200).json({
          message: "Fetched the detail of the treatment!",
          data: treatment,
        });
      }
    }
  } catch (e) {
    console.error(
      "Some error in getting the treatment prescription! ",
      e.message
    );
    return res.status(500).json({
      message: "Some error in getting the treatment prescription!",
      error: e.message,
    });
  }
};
