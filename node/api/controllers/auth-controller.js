import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("אימייל או סיסמה שגויים");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("אימייל או סיסמה שגויים");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({
      message: "התחברת בהצלחה",
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, fullName, email, password, id } = req.body;

    // If only fullName is provided, split it into firstName and lastName
    let fName = firstName;
    let lName = lastName;
    
    if (!firstName && !lastName && fullName) {
      const parts = fullName.trim().split(" ");
      fName = parts[0];
      lName = parts.slice(1).join(" ") || parts[0];
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("האימייל הזה כבר קיים במערכת");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: fName,
      lastName: lName,
      fullName: fullName || `${fName} ${lName}`,
      email,
      password: hashedPassword,
      id: id,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    await user.save();
    res.status(201).json({
      message: "המשתמש נרשם בהצלחה",
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, fullName: user.fullName },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default { login, register };
