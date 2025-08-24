import type { Request, Response, NextFunction } from "express";
export interface CustomError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export declare const createError: (message: string, statusCode: number) => CustomError;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=errorHandler.d.ts.map