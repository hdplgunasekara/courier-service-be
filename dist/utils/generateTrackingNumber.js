"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingNumber = void 0;
const generateTrackingNumber = () => {
    const prefix = "CS"; // Courier Service
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
};
exports.generateTrackingNumber = generateTrackingNumber;
//# sourceMappingURL=generateTrackingNumber.js.map