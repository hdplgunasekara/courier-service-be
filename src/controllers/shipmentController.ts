import type { Response, NextFunction, Request } from "express"
import { PrismaClient, ShipmentStatus } from "@prisma/client"
import { validationResult } from "express-validator"
import { asyncHandler, createError } from "../middleware/errorHandler"
import { generateTrackingNumber } from "../utils/generateTrackingNumber"
import type { AuthRequest, ApiResponse } from "../types"

const prisma = new PrismaClient()

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private
export const createShipment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    return next(createError(errorMessages, 400))
  }

  const { recipientName, recipientAddress, weight, dimensions, description, estimatedDelivery } = req.body

  // Get user details for sender information
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { name: true, address: true },
  })

  if (!user) {
    return next(createError("User not found", 404))
  }

  const trackingNumber = generateTrackingNumber()

  const shipment = await prisma.shipment.create({
    data: {
      trackingNumber,
      senderName: user.name,
      senderAddress: user.address,
      recipientName,
      recipientAddress,
      weight: Number.parseFloat(weight),
      dimensions,
      description,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      userId: req.user!.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      trackingHistory: true,
    },
  })

  // Create initial tracking entry
  await prisma.shipmentTracking.create({
    data: {
      shipmentId: shipment.id,
      status: ShipmentStatus.PENDING,
      description: "Shipment created and pending pickup",
    },
  })

  const response: ApiResponse = {
    success: true,
    message: "Shipment created successfully",
    data: { shipment },
  }

  res.status(201).json(response)
})

// @desc    Get user's shipments
// @route   GET /api/shipments
// @access  Private
export const getShipments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const page = Number.parseInt(req.query.page as string) || 1
  const limit = Number.parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  // If user is ADMIN, fetch all shipments; otherwise only their own
  const whereClause = req.user?.role === "ADMIN" 
    ? {} 
    : { userId: req.user!.id }

  const shipments = await prisma.shipment.findMany({
    where: whereClause,
    include: {
      trackingHistory: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  })

  const total = await prisma.shipment.count({
    where: { userId: req.user!.id },
  })

  const response: ApiResponse = {
    success: true,
    message: "Shipments retrieved successfully",
    data: {
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  }

  res.status(200).json(response)
})

// @desc    Get all shipments (Admin only)
// @route   GET /api/shipments/all
// @access  Private/Admin
export const getAllShipments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const page = Number.parseInt(req.query.page as string) || 1
  const limit = Number.parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  const shipments = await prisma.shipment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      trackingHistory: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  })

  const total = await prisma.shipment.count()

  const response: ApiResponse = {
    success: true,
    message: "All shipments retrieved successfully",
    data: {
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  }

  res.status(200).json(response)
})

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
export const getShipment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      trackingHistory: {
        orderBy: { timestamp: "desc" },
      },
    },
  })

  if (!shipment) {
    return next(createError("Shipment not found", 404))
  }

  // Check if user owns the shipment or is admin
  if (shipment.userId !== req.user!.id && req.user!.role !== "ADMIN") {
    return next(createError("Not authorized to access this shipment", 403))
  }

  const response: ApiResponse = {
    success: true,
    message: "Shipment retrieved successfully",
    data: { shipment },
  }

  res.status(200).json(response)
})

// @desc    Track shipment by tracking number
// @route   GET /api/shipments/track/:trackingNumber
// @access  Public
export const trackShipment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    return next(createError(errorMessages, 400))
  }

  const { trackingNumber } = req.params

  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber },
    select: {
      id: true,
      trackingNumber: true,
      senderName: true,
      recipientName: true,
      status: true,
      estimatedDelivery: true,
      actualDelivery: true,
      createdAt: true,
      trackingHistory: {
        orderBy: { timestamp: "desc" },
      },
    },
  })

  if (!shipment) {
    return next(createError("Shipment not found with this tracking number", 404))
  }

  const response: ApiResponse = {
    success: true,
    message: "Shipment tracking information retrieved successfully",
    data: { shipment },
  }

  res.status(200).json(response)
})

// @desc    Update shipment status (Admin only)
// @route   PUT /api/shipments/:id/status
// @access  Private/Admin
export const updateShipmentStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    return next(createError(errorMessages, 400))
  }

  const { id } = req.params
  const { status, location, description } = req.body

  const shipment = await prisma.shipment.findUnique({
    where: { id },
  })

  if (!shipment) {
    return next(createError("Shipment not found", 404))
  }

   // Check if user owns the shipment or is admin
  if (shipment.userId !== req.user!.id && req.user!.role !== "ADMIN") {
    return next(createError("Not authorized to update this shipment", 403))
  }

  // Update shipment status
  const updatedShipment = await prisma.shipment.update({
    where: { id },
    data: {
      status,
      actualDelivery: status === ShipmentStatus.DELIVERED ? new Date() : null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      trackingHistory: {
        orderBy: { timestamp: "desc" },
      },
    },
  })

  // Create tracking history entry
  await prisma.shipmentTracking.create({
    data: {
      shipmentId: id,
      status,
      location,
      description,
    },
  })

  const response: ApiResponse = {
    success: true,
    message: "Shipment status updated successfully",
    data: { shipment: updatedShipment },
  }

  res.status(200).json(response)
})

// @desc    Get shipment statistics
// @route   GET /api/shipments/stats
// @access  Private
export const getShipmentStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.role === "ADMIN" ? undefined : req.user!.id

  const whereClause = userId ? { userId } : {}

  const [totalShipments, statusCounts, recentShipments] = await Promise.all([
    prisma.shipment.count({ where: whereClause }),
    prisma.shipment.groupBy({
      by: ["status"],
      where: whereClause,
      _count: {
        status: true,
      },
    }),
    prisma.shipment.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        trackingNumber: true,
        recipientName: true,
        status: true,
        createdAt: true,
      },
    }),
  ])

  const stats = {
    total: totalShipments,
    byStatus: statusCounts.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status
        return acc
      },
      {} as Record<string, number>,
    ),
    recent: recentShipments,
  }

  const response: ApiResponse = {
    success: true,
    message: "Shipment statistics retrieved successfully",
    data: { stats },
  }

  res.status(200).json(response)
})

// @desc    Search shipments
// @route   GET /api/shipments/search
// @access  Private
export const searchShipments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { q, status, dateFrom, dateTo, page = 1, limit = 10 } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const whereClause: any = {}

  // Role-based filtering
  if (req.user!.role !== "ADMIN") {
    whereClause.userId = req.user!.id
  }

  // Search query
  if (q) {
    whereClause.OR = [
      { trackingNumber: { contains: q as string, mode: "insensitive" } },
      { recipientName: { contains: q as string, mode: "insensitive" } },
      { senderName: { contains: q as string, mode: "insensitive" } },
      { description: { contains: q as string, mode: "insensitive" } },
    ]
  }

  // Status filter
  if (status && status !== "ALL") {
    whereClause.status = status
  }

  // Date range filter
  if (dateFrom || dateTo) {
    whereClause.createdAt = {}
    if (dateFrom) {
      whereClause.createdAt.gte = new Date(dateFrom as string)
    }
    if (dateTo) {
      whereClause.createdAt.lte = new Date(dateTo as string)
    }
  }

  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        trackingHistory: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.shipment.count({ where: whereClause }),
  ])

  const response: ApiResponse = {
    success: true,
    message: "Search results retrieved successfully",
    data: {
      shipments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      filters: {
        query: q,
        status,
        dateFrom,
        dateTo,
      },
    },
  }

  res.status(200).json(response)
})

// @desc    Bulk update shipment statuses (Admin only)
// @route   PUT /api/shipments/bulk-update
// @access  Private/Admin
export const bulkUpdateShipments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    return next(createError(errorMessages, 400))
  }

  const { shipmentIds, status, location, description } = req.body

  if (!Array.isArray(shipmentIds) || shipmentIds.length === 0) {
    return next(createError("Please provide an array of shipment IDs", 400))
  }

  // Update all shipments
  const updatedShipments = await prisma.shipment.updateMany({
    where: {
      id: {
        in: shipmentIds,
      },
    },
    data: {
      status,
      actualDelivery: status === ShipmentStatus.DELIVERED ? new Date() : undefined,
    },
  })

  // Create tracking history entries for all shipments
  const trackingEntries = shipmentIds.map((shipmentId) => ({
    shipmentId,
    status,
    location,
    description,
  }))

  await prisma.shipmentTracking.createMany({
    data: trackingEntries,
  })

  const response: ApiResponse = {
    success: true,
    message: `${updatedShipments.count} shipments updated successfully`,
    data: {
      updatedCount: updatedShipments.count,
      status,
    },
  }

  res.status(200).json(response)
})

// @desc    Delete shipment (Admin only)
// @route   DELETE /api/shipments/:id
// @access  Private/Admin
export const deleteShipment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params

  const shipment = await prisma.shipment.findUnique({
    where: { id },
  })

  if (!shipment) {
    return next(createError("Shipment not found", 404))
  }

  // Check if user owns the shipment or is admin
  if (shipment.userId !== req.user!.id && req.user!.role !== "ADMIN") {
    return next(createError("Not authorized to delete this shipment", 403))
  }

  // Delete shipment (cascade will handle tracking history)
  await prisma.shipment.delete({
    where: { id },
  })

  const response: ApiResponse = {
    success: true,
    message: "Shipment deleted successfully",
    data: null,
  }

  res.status(200).json(response)
})

// @desc    Get shipment tracking history
// @route   GET /api/shipments/:id/tracking
// @access  Private
export const getShipmentTracking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      trackingNumber: true,
      status: true,
    },
  })

  if (!shipment) {
    return next(createError("Shipment not found", 404))
  }

  // Check if user owns the shipment or is admin
  if (shipment.userId !== req.user!.id && req.user!.role !== "ADMIN") {
    return next(createError("Not authorized to access this shipment", 403))
  }

  const trackingHistory = await prisma.shipmentTracking.findMany({
    where: { shipmentId: id },
    orderBy: { timestamp: "desc" },
  })

  const response: ApiResponse = {
    success: true,
    message: "Tracking history retrieved successfully",
    data: {
      shipment: {
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
      },
      trackingHistory,
    },
  }

  res.status(200).json(response)
})

// @desc    Add tracking update to shipment (Admin only)
// @route   POST /api/shipments/:id/tracking
// @access  Private/Admin
export const addTrackingUpdate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    return next(createError(errorMessages, 400))
  }

  const { id } = req.params
  const { status, location, description } = req.body

  const shipment = await prisma.shipment.findUnique({
    where: { id },
  })

  if (!shipment) {
    return next(createError("Shipment not found", 404))
  }

  // Create tracking entry
  const trackingEntry = await prisma.shipmentTracking.create({
    data: {
      shipmentId: id,
      status,
      location,
      description,
    },
  })

  // Update shipment status if different
  if (shipment.status !== status) {
    await prisma.shipment.update({
      where: { id },
      data: {
        status,
        actualDelivery: status === ShipmentStatus.DELIVERED ? new Date() : undefined,
      },
    })
  }

  const response: ApiResponse = {
    success: true,
    message: "Tracking update added successfully",
    data: { trackingEntry },
  }

  res.status(201).json(response)
})
