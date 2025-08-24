import { body, param } from "express-validator"

// Authentication validation
export const validateRegister = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("phone").isMobilePhone("any").withMessage("Please provide a valid phone number"),
  body("address").trim().isLength({ min: 10, max: 200 }).withMessage("Address must be between 10 and 200 characters"),
]

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
]

// User profile validation
export const validateUpdateProfile = [
  body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("phone").optional().isMobilePhone("any").withMessage("Please provide a valid phone number"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),
]

// Shipment validation
export const validateCreateShipment = [
  body("recipientName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Recipient name must be between 2 and 50 characters"),
  body("recipientAddress")
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Recipient address must be between 10 and 200 characters"),
  body("weight").isFloat({ min: 0.1, max: 1000 }).withMessage("Weight must be between 0.1 and 1000 kg"),
  body("dimensions").trim().isLength({ min: 5, max: 50 }).withMessage("Dimensions must be between 5 and 50 characters"),
  body("description")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Description must be between 5 and 200 characters"),
  body("estimatedDelivery").optional().isISO8601().withMessage("Please provide a valid date for estimated delivery"),
]

export const validateUpdateShipmentStatus = [
  body("status")
    .isIn(["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
    .withMessage("Invalid shipment status"),
  body("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Description must be between 5 and 200 characters"),
]

// Bulk update and tracking validation
export const validateBulkUpdate = [
  body("shipmentIds").isArray({ min: 1 }).withMessage("Please provide an array of shipment IDs"),
  body("shipmentIds.*").isLength({ min: 1 }).withMessage("Each shipment ID must be valid"),
  body("status")
    .isIn(["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
    .withMessage("Invalid shipment status"),
  body("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Description must be between 5 and 200 characters"),
]

export const validateTrackingUpdate = [
  body("status")
    .isIn(["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
    .withMessage("Invalid shipment status"),
  body("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Description must be between 5 and 200 characters"),
]

// Parameter validation
export const validateShipmentId = [param("id").isLength({ min: 1 }).withMessage("Shipment ID is required")]

export const validateTrackingNumber = [
  param("trackingNumber").isLength({ min: 1 }).withMessage("Tracking number is required"),
]
