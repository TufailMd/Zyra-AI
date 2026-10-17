
import mongoose from "mongoose"

const connection = mongoose.connection

const getErrorDetails = (error) => ({
    name: error instanceof Error ? error.name : "UnknownError",
    code: error && typeof error === "object" ? error.code : undefined,
    message: error instanceof Error
        ? error.message.replace(/mongodb(?:\+srv)?:\/\/[^\s"'`]+/gi, "[redacted MongoDB URI]")
        : "Unknown error"
})

connection.on("error", (error) => {
    console.error("MongoDB connection error", {
        ...getErrorDetails(error),
        readyState: connection.readyState
    })
})

connection.on("disconnected", () => {
    console.error("MongoDB disconnected", { readyState: connection.readyState })
})

const connectDb = async () => {
    console.info("Connecting to MongoDB", { readyState: connection.readyState })
    try {
        const uri = process.env.MONGODB_URL
        if (!uri) {
            throw new Error("MONGODB_URL is not configured")
        }

        await mongoose.connect(uri)
        console.info("MongoDB connected", { readyState: connection.readyState })
    } catch (error) {
        console.error("MongoDB initial connection failed", {
            ...getErrorDetails(error),
            readyState: connection.readyState
        })
        throw error
    }
}

export default connectDb