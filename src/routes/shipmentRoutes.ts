import express from "express"
import {
  createShipment,
  getShipments,
  getShipment,
  updateShipmentStatus,
  trackShipment,
  getAllShipments,
  getShipmentStats,
  searchShipments,
  bulkUpdateShipments,
  deleteShipment,
  getShipmentTracking,
  addTrackingUpdate,
} from "../controllers/shipmentController"
import { protect, authorize } from "../middleware/auth"
import {
  validateCreateShipment,
  validateUpdateShipmentStatus,
  validateShipmentId,
  validateTrackingNumber,
  validateBulkUpdate,
  validateTrackingUpdate,
} from "../middleware/validation"

const router = express.Router()

// Public route for tracking
router.get("/track/:trackingNumber", validateTrackingNumber, trackShipment)

router.use(protect) // All other routes are protected

// User routes
router.post("/", validateCreateShipment, createShipment)
router.get("/", getShipments)
router.get("/stats", getShipmentStats)
router.get("/search", searchShipments)
router.get("/:id", validateShipmentId, getShipment)
router.get("/:id/tracking", validateShipmentId, getShipmentTracking)
router.put("/:id/status", validateShipmentId, validateUpdateShipmentStatus, updateShipmentStatus)
router.delete("/:id", validateShipmentId, deleteShipment)

// Admin only routes
router.get("/all", authorize("ADMIN"), getAllShipments)
router.put("/bulk-update", validateBulkUpdate, authorize("ADMIN"), bulkUpdateShipments)
router.post("/:id/tracking", validateShipmentId, validateTrackingUpdate, authorize("ADMIN"), addTrackingUpdate)

export default router
