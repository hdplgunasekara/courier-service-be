"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTrackingNumber = exports.validateShipmentId = exports.validateTrackingUpdate = exports.validateBulkUpdate = exports.validateUpdateShipmentStatus = exports.validateCreateShipment = exports.validateUpdateProfile = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
// Authentication validation
exports.validateRegister = [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    (0, express_validator_1.body)("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    (0, express_validator_1.body)("phone").isMobilePhone("any").withMessage("Please provide a valid phone number"),
    (0, express_validator_1.body)("address").trim().isLength({ min: 10, max: 200 }).withMessage("Address must be between 10 and 200 characters"),
];
exports.validateLogin = [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
// User profile validation
exports.validateUpdateProfile = [
    (0, express_validator_1.body)("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    (0, express_validator_1.body)("phone").optional().isMobilePhone("any").withMessage("Please provide a valid phone number"),
    (0, express_validator_1.body)("address")
        .optional()
        .trim()
        .isLength({ min: 10, max: 200 })
        .withMessage("Address must be between 10 and 200 characters"),
];
// Shipment validation
exports.validateCreateShipment = [
    (0, express_validator_1.body)("recipientName")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Recipient name must be between 2 and 50 characters"),
    (0, express_validator_1.body)("recipientAddress")
        .trim()
        .isLength({ min: 10, max: 200 })
        .withMessage("Recipient address must be between 10 and 200 characters"),
    (0, express_validator_1.body)("weight").isFloat({ min: 0.1, max: 1000 }).withMessage("Weight must be between 0.1 and 1000 kg"),
    (0, express_validator_1.body)("dimensions").trim().isLength({ min: 5, max: 50 }).withMessage("Dimensions must be between 5 and 50 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage("Description must be between 5 and 200 characters"),
    (0, express_validator_1.body)("estimatedDelivery").optional().isISO8601().withMessage("Please provide a valid date for estimated delivery"),
];
exports.validateUpdateShipmentStatus = [
    (0, express_validator_1.body)("status")
        .isIn(["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
        .withMessage("Invalid shipment status"),
    (0, express_validator_1.body)("location")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Location must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage("Description must be between 5 and 200 characters"),
];
// Bulk update and tracking validation
exports.validateBulkUpdate = [
    (0, express_validator_1.body)("shipmentIds").isArray({ min: 1 }).withMessage("Please provide an array of shipment IDs"),
    (0, express_validator_1.body)("shipmentIds.*").isLength({ min: 1 }).withMessage("Each shipment ID must be valid"),
    (0, express_validator_1.body)("status")
        .isIn(["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
        .withMessage("Invalid shipment status"),
    (0, express_validator_1.body)("location")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Location must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage("Description must be between 5 and 200 characters"),
];
exports.validateTrackingUpdate = [
    (0, express_validator_1.body)("status")
        .isIn(["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
        .withMessage("Invalid shipment status"),
    (0, express_validator_1.body)("location")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Location must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage("Description must be between 5 and 200 characters"),
];
// Parameter validation
exports.validateShipmentId = [(0, express_validator_1.param)("id").isLength({ min: 1 }).withMessage("Shipment ID is required")];
exports.validateTrackingNumber = [
    (0, express_validator_1.param)("trackingNumber").isLength({ min: 1 }).withMessage("Tracking number is required"),
];
//# sourceMappingURL=validation.js.map