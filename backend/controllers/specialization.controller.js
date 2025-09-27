import Specialization from "../models/specialization.model.js";
import User from "../models/users.model.js";

export const createSpecialization = async (req, res) => {
  let { specialization } = req.body;

  if (!specialization || specialization.trim() === "") {
    return res.status(400).json({ message: "Specialization is required!" });
  }

  try {
    specialization = specialization.toLowerCase().trim()

    let existingspec = await Specialization.findOne({specialization:specialization})
    if(existingspec)
    {
        return res.status(409).json({ message: "Specialization already exists!" });
    }

    const doctorsWithSpec = await Specialization.find({
        specialization:{
            $elemMatch: { $regex: new RegExp(`^${specialization}`, "i") }
        }
    }).select("_id")

    const doctorIds = doctorsWithSpec.map((doc)=>doc._id)

    const newSpec = await Specialization.create({
        specialization,
        doctors:doctorIds
    })

    return res.status(201).json({
      message: "Specialization created successfully!",
      data: newSpec,
    });


  } catch (e) {
    console.error("Error creating specialization:", err.message);
    return res.status(500).json({
      message: "Error creating specialization!",
      error: err.message,
    });
  }
};
