"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShipmentTransition = exports.formatTrackingNumber = exports.calculateEstimatedDelivery = exports.getStatusLabel = exports.getStatusColor = void 0;
const client_1 = require("@prisma/client");
const getStatusColor = (status) => {
    const statusColors = {
        [client_1.ShipmentStatus.PENDING]: "#f59e0b", // amber
        [client_1.ShipmentStatus.PICKED_UP]: "#3b82f6", // blue
        [client_1.ShipmentStatus.IN_TRANSIT]: "#8b5cf6", // violet
        [client_1.ShipmentStatus.OUT_FOR_DELIVERY]: "#f97316", // orange
        [client_1.ShipmentStatus.DELIVERED]: "#10b981", // emerald
        [client_1.ShipmentStatus.CANCELLED]: "#ef4444", // red
    };
    return statusColors[status] || "#6b7280"; // gray as fallback
};
exports.getStatusColor = getStatusColor;
const getStatusLabel = (status) => {
    const statusLabels = {
        [client_1.ShipmentStatus.PENDING]: "Pending Pickup",
        [client_1.ShipmentStatus.PICKED_UP]: "Picked Up",
        [client_1.ShipmentStatus.IN_TRANSIT]: "In Transit",
        [client_1.ShipmentStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
        [client_1.ShipmentStatus.DELIVERED]: "Delivered",
        [client_1.ShipmentStatus.CANCELLED]: "Cancelled",
    };
    return statusLabels[status] || "Unknown";
};
exports.getStatusLabel = getStatusLabel;
const calculateEstimatedDelivery = (weight, distance) => {
    // Simple estimation logic - can be enhanced with real logistics data
    const baseDeliveryDays = 2;
    const weightFactor = weight > 10 ? 1 : 0;
    const distanceFactor = distance ? Math.ceil(distance / 500) : 1;
    const estimatedDays = baseDeliveryDays + weightFactor + distanceFactor;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
    return estimatedDate;
};
exports.calculateEstimatedDelivery = calculateEstimatedDelivery;
const formatTrackingNumber = (trackingNumber) => {
    // Format: CS-XXXXXXXX-XXXX
    if (trackingNumber.length >= 12) {
        return `${trackingNumber.slice(0, 2)}-${trackingNumber.slice(2, 10)}-${trackingNumber.slice(10)}`;
    }
    return trackingNumber;
};
exports.formatTrackingNumber = formatTrackingNumber;
const validateShipmentTransition = (currentStatus, newStatus) => {
    const validTransitions = {
        [client_1.ShipmentStatus.PENDING]: [client_1.ShipmentStatus.PICKED_UP, client_1.ShipmentStatus.CANCELLED],
        [client_1.ShipmentStatus.PICKED_UP]: [client_1.ShipmentStatus.IN_TRANSIT, client_1.ShipmentStatus.CANCELLED],
        [client_1.ShipmentStatus.IN_TRANSIT]: [client_1.ShipmentStatus.OUT_FOR_DELIVERY, client_1.ShipmentStatus.CANCELLED],
        [client_1.ShipmentStatus.OUT_FOR_DELIVERY]: [client_1.ShipmentStatus.DELIVERED, client_1.ShipmentStatus.CANCELLED],
        [client_1.ShipmentStatus.DELIVERED]: [], // Final state
        [client_1.ShipmentStatus.CANCELLED]: [], // Final state
    };
    return validTransitions[currentStatus]?.includes(newStatus) || false;
};
exports.validateShipmentTransition = validateShipmentTransition;
//# sourceMappingURL=shipmentHelpers.js.map