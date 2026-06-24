import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // checking mail already exist?
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "email already exists !!" });
    }
    if (password.lenth < 8) {
      return res
        .status(400)
        .json({ message: "pass must be at least 6 character" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // user created
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `sign up error` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email does not  exists !!" });
    }
    const isMtch = await bcrypt.compare(passsword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "incorrect password" });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `login error` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.cleaarCookie("token");
    return res.status(200).json({ message: "log out succesfully" });
  } catch (error) {
    return res.status(500).json({ message: `logout error` });
  }
};
