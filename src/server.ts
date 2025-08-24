import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/errorHandler"
import { notFound } from "./middleware/notFound"
import authRoutes from "./routes/authRoutes"
import shipmentRoutes from "./routes/shipmentRoutes"
import userRoutes from "./routes/userRoutes"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// })

// Middleware
app.use(helmet())
// app.use(limiter)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Courier Service API is running",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/shipments", shipmentRoutes)
app.use("/api/users", userRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
})

export default app
