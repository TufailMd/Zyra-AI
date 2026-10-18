import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  assistantName: user.assistantName,
  assistantImage: user.assistantImage,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const logAuthFailure = (operation, error) => {
  console.error(`Authentication ${operation} failed`, {
    error: error instanceof Error ? error.name : "UnknownError",
    mongooseReadyState: mongoose.connection.readyState,
  });
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "email already exists !" });
    }
    if (!password || !name || !email) {
      return res
        .status(400)
        .json({ message: "name, email and password are required !" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Signup successful",
      user: publicUser(user),
    });
  } catch (error) {
    logAuthFailure("signup", error);
    return res.status(500).json({ message: "sign up failed" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required !" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email does not exists !" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (error) {
    logAuthFailure("signin", error);
    return res.status(500).json({ message: "login failed" });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({ message: `logout error ${error}` });
  }
};
