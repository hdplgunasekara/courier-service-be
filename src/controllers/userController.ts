import type { Response, NextFunction } from "express"
import { PrismaClient } from "@prisma/client"
import { validationResult } from "express-validator"
import { asyncHandler, createError } from "../middleware/errorHandler"
import type { AuthRequest, ApiResponse } from "../types"

const prisma = new PrismaClient()

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          shipments: true,
        },
      },
    },
  })

  if (!user) {
    return next(createError("User not found", 404))
  }

  const response: ApiResponse = {
    success: true,
    message: "Profile retrieved successfully",
    data: { user },
  }

  res.status(200).json(response)
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(createError("Validation failed", 400))
  }

  const { name, phone, address } = req.body

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      name,
      phone,
      address,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      role: true,
      updatedAt: true,
    },
  })

  const response: ApiResponse = {
    success: true,
    message: "Profile updated successfully",
    data: { user },
  }

  res.status(200).json(response)
})
