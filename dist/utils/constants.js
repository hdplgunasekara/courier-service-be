"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION = exports.JWT_CONFIG = exports.USER_ROLES = exports.SHIPMENT_STATUSES = void 0;
exports.SHIPMENT_STATUSES = {
    PENDING: "PENDING",
    PICKED_UP: "PICKED_UP",
    IN_TRANSIT: "IN_TRANSIT",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
};
exports.USER_ROLES = {
    USER: "USER",
    ADMIN: "ADMIN",
};
exports.JWT_CONFIG = {
    EXPIRES_IN: "7d",
    ALGORITHM: "HS256",
};
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};
//# sourceMappingURL=constants.js.map