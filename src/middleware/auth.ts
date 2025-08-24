import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { createError } from "./errorHandler"
import type { AuthRequest } from "../types"

const prisma = new PrismaClient()

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return next(createError("Not authorized to access this route", 401))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true },
      })

      if (!user) {
        return next(createError("No user found with this token", 401))
      }

      req.user = user
      next()
    } catch (error) {
      return next(createError("Not authorized to access this route", 401))
    }
  } catch (error) {
    next(error)
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not authenticated", 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(createError("User role not authorized to access this route", 403))
    }

    next()
  }
}
