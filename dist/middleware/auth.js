"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("./errorHandler");
const prisma = new client_1.PrismaClient();
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next((0, errorHandler_1.createError)("Not authorized to access this route", 401));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, role: true },
            });
            if (!user) {
                return next((0, errorHandler_1.createError)("No user found with this token", 401));
            }
            req.user = user;
            next();
        }
        catch (error) {
            return next((0, errorHandler_1.createError)("Not authorized to access this route", 401));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next((0, errorHandler_1.createError)("User not authenticated", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next((0, errorHandler_1.createError)("User role not authorized to access this route", 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map