"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const generateToken_1 = require("../utils/generateToken");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error) => error.msg)
            .join(", ");
        return next((0, errorHandler_1.createError)(errorMessages, 400));
    }
    const { email, password, name, phone, address } = req.body;
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return next((0, errorHandler_1.createError)("User already exists with this email", 400));
    }
    // Hash password
    const salt = await bcryptjs_1.default.genSalt(12);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
            address,
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            role: true,
            createdAt: true,
        },
    });
    const token = (0, generateToken_1.generateToken)(user.id);
    const response = {
        success: true,
        message: "User registered successfully",
        data: {
            user,
            token,
        },
    };
    res.status(201).json(response);
});
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error) => error.msg)
            .join(", ");
        return next((0, errorHandler_1.createError)(errorMessages, 400));
    }
    const { email, password } = req.body;
    // Check for user
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return next((0, errorHandler_1.createError)("Invalid credentials", 401));
    }
    // Check password
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return next((0, errorHandler_1.createError)("Invalid credentials", 401));
    }
    const token = (0, generateToken_1.generateToken)(user.id);
    const response = {
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                role: user.role,
                createdAt: user.createdAt,
            },
            token,
        },
    };
    console.log(response);
    res.status(200).json(response);
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        return next((0, errorHandler_1.createError)("User not found", 404));
    }
    const response = {
        success: true,
        message: "User data retrieved successfully",
        data: { user },
    };
    res.status(200).json(response);
});
//# sourceMappingURL=authController.js.map