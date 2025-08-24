"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipmentController_1 = require("../controllers/shipmentController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Public route for tracking
router.get("/track/:trackingNumber", validation_1.validateTrackingNumber, shipmentController_1.trackShipment);
router.use(auth_1.protect); // All other routes are protected
// User routes
router.post("/", validation_1.validateCreateShipment, shipmentController_1.createShipment);
router.get("/", shipmentController_1.getShipments);
router.get("/stats", shipmentController_1.getShipmentStats);
router.get("/search", shipmentController_1.searchShipments);
router.get("/:id", validation_1.validateShipmentId, shipmentController_1.getShipment);
router.get("/:id/tracking", validation_1.validateShipmentId, shipmentController_1.getShipmentTracking);
router.put("/:id/status", validation_1.validateShipmentId, validation_1.validateUpdateShipmentStatus, shipmentController_1.updateShipmentStatus);
router.delete("/:id", validation_1.validateShipmentId, shipmentController_1.deleteShipment);
// Admin only routes
router.get("/all", (0, auth_1.authorize)("ADMIN"), shipmentController_1.getAllShipments);
router.put("/bulk-update", validation_1.validateBulkUpdate, (0, auth_1.authorize)("ADMIN"), shipmentController_1.bulkUpdateShipments);
router.post("/:id/tracking", validation_1.validateShipmentId, validation_1.validateTrackingUpdate, (0, auth_1.authorize)("ADMIN"), shipmentController_1.addTrackingUpdate);
exports.default = router;
//# sourceMappingURL=shipmentRoutes.js.map