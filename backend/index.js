import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"

const app=express()
app.use(cors({
    origin:"https://zyra-ai-tkla.onrender.com",
    credentials:true
}))
const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

const startServer = async () => {
    try {
        await connectDb()
    } catch (error) {
        console.error("Startup aborted; HTTP server was not started", {
            error: error instanceof Error ? error.name : "UnknownError",
            mongooseReadyState: mongoose.connection.readyState
        })
        process.exit(1)
    }

    const server = app.listen(port, () => {
        console.info("HTTP server listening", {
            port,
            mongooseReadyState: mongoose.connection.readyState
        })
    })

    server.on("error", (error) => {
        console.error("HTTP server failed", {
            name: error.name,
            code: error.code
        })
        process.exit(1)
    })
}

startServer()
