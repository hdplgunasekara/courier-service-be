"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
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
            _count: {
                select: {
                    shipments: true,
                },
            },
        },
    });
    if (!user) {
        return next((0, errorHandler_1.createError)("User not found", 404));
    }
    const response = {
        success: true,
        message: "Profile retrieved successfully",
        data: { user },
    };
    res.status(200).json(response);
});
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next((0, errorHandler_1.createError)("Validation failed", 400));
    }
    const { name, phone, address } = req.body;
    const user = await prisma.user.update({
        where: { id: req.user.id },
        data: {
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
            updatedAt: true,
        },
    });
    const response = {
        success: true,
        message: "Profile updated successfully",
        data: { user },
    };
    res.status(200).json(response);
});
//# sourceMappingURL=userController.js.map