import { ShipmentStatus } from "@prisma/client";
export declare const getStatusColor: (status: ShipmentStatus) => string;
export declare const getStatusLabel: (status: ShipmentStatus) => string;
export declare const calculateEstimatedDelivery: (weight: number, distance?: number) => Date;
export declare const formatTrackingNumber: (trackingNumber: string) => string;
export declare const validateShipmentTransition: (currentStatus: ShipmentStatus, newStatus: ShipmentStatus) => boolean;
//# sourceMappingURL=shipmentHelpers.d.ts.map