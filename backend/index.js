import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

const app = express();
app.use(
  cors({
    origin: "https://zyra-ai-tkla.onrender.com",
    credentials: true,
  }),
);
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

startServer();
