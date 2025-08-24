"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const shipmentRoutes_1 = __importDefault(require("./routes/shipmentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// })
// Middleware
app.use((0, helmet_1.default)());
// app.use(limiter)
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Courier Service API is running",
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/shipments", shipmentRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
// Error handling middleware
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map