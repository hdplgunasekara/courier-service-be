import type { Response, NextFunction, Request } from "express";
export declare const createShipment: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const getShipments: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const getAllShipments: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const getShipment: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const trackShipment: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const updateShipmentStatus: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const getShipmentStats: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const searchShipments: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const bulkUpdateShipments: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const deleteShipment: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const getShipmentTracking: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const addTrackingUpdate: (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=shipmentController.d.ts.map