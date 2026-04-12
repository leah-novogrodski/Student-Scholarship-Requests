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
      { id: user.id, email: user.email ,name: user.fullName},
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.status(200).json({
      message: "התחברת בהצלחה",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password, id } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("האימייל הזה כבר קיים במערכת");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      id
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    await user.save();
    res.status(201).json({
      message: "המשתמש נרשם בהצלחה",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default { login, register };
