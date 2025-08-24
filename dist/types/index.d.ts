import type { Request } from "express";
export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    role: "USER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
}
export interface Shipment {
    id: string;
    trackingNumber: string;
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    weight: number;
    dimensions: string;
    description: string;
    status: ShipmentStatus;
    estimatedDelivery: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum ShipmentStatus {
    PENDING = "PENDING",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map