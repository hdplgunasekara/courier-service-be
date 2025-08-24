import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { validationResult } from "express-validator"
import { generateToken } from "../utils/generateToken"
import { asyncHandler, createError } from "../middleware/errorHandler"
import type { AuthRequest, ApiResponse } from "../types"

const prisma = new PrismaClient()

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    return next(createError(errorMessages, 400))
  }

  const { email, password, name, phone, address } = req.body

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return next(createError("User already exists with this email", 400))
  }

  // Hash password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
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
      createdAt: true,
    },
  })

  const token = generateToken(user.id)

  const response: ApiResponse = {
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token,
    },
  }

  res.status(201).json(response)
})

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    return next(createError(errorMessages, 400))
  }

  const { email, password } = req.body

  // Check for user
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return next(createError("Invalid credentials", 401))
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return next(createError("Invalid credentials", 401))
  }

  const token = generateToken(user.id)

  const response: ApiResponse = {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  }

  console.log(response)

  res.status(200).json(response)
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    },
  })

  if (!user) {
    return next(createError("User not found", 404))
  }

  const response: ApiResponse = {
    success: true,
    message: "User data retrieved successfully",
    data: { user },
  }

  res.status(200).json(response)
})
