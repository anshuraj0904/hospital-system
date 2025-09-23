import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/users.model.js";
import jwt from "jsonwebtoken";

export const patientsignUp = async (req, res) => {
  const { email, name, password } = req.body;
  let { specialization } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Some of the details are missing!" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email!" });
  }

  const isUserExisting = await User.findOne({ email });
  if (isUserExisting) {
    return res.status(409).json({
      message: "This user already exists!",
    });
  }

  let role, signupMessage;
  if (Array.isArray(specialization) && specialization.length > 0) {
    role = "doctor";
    signupMessage =
      "Welcome onboard Doctor! Looking forward to seeing you make a difference.";
  } else {
    role = "patient";
    signupMessage =
      "Patient signup successful! Login to access our facilities.";
  }

  try {
    const hashed_password = await bcrypt.hash(password, 10);
    await User.create({
      name: name,
      email: email,
      password: hashed_password,
      role: role,
      specialization: role === "doctor" ? specialization:[],
      status: role === "doctor" ? "available" : undefined
    });

    return res
      .status(201)
      .json({
        message: signupMessage,
      });
  } catch (e) {
    console.error("Error creating the user!", e);
    return res.status(500).json({
      message: "Signup Failed!",
      details: e.message,
    });
  }
};


export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter your credentials!"
    });
  }

  try {
    const isUser = await User.findOne({ email });

    if (!isUser) {
      return res.status(401).json({
        message: "User does not exist!"
      });
    }

    const isPasswrdMatch = await bcrypt.compare(password, isUser.password);

    if (!isPasswrdMatch) {
      return res.status(401).json({
        message: "Password doesn't match!"
      });
    }

    const userdets = await User.findOne({ email }).select("-password");

    const token = jwt.sign(
      { id: userdets._id, role: userdets.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 // 1 hour
    });

    return res.status(200).json({
      message: "Signed in successfully!",
      data: userdets
    });
  } catch (e) {
    console.error("Error during login:", e);
    return res.status(500).json({
      message: "Login failed due to server error",
      details: e.message
    });
  }
};



export const userLogout = async(_,res)=>{
   res.clearCookie("token",{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict"
   })

   return res.status(200).json({
    message:"User logged out successfully!"
   })
}