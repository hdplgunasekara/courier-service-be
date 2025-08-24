import { ShipmentStatus } from "@prisma/client"

export const getStatusColor = (status: ShipmentStatus): string => {
  const statusColors = {
    [ShipmentStatus.PENDING]: "#f59e0b", // amber
    [ShipmentStatus.PICKED_UP]: "#3b82f6", // blue
    [ShipmentStatus.IN_TRANSIT]: "#8b5cf6", // violet
    [ShipmentStatus.OUT_FOR_DELIVERY]: "#f97316", // orange
    [ShipmentStatus.DELIVERED]: "#10b981", // emerald
    [ShipmentStatus.CANCELLED]: "#ef4444", // red
  }
  return statusColors[status] || "#6b7280" // gray as fallback
}

export const getStatusLabel = (status: ShipmentStatus): string => {
  const statusLabels = {
    [ShipmentStatus.PENDING]: "Pending Pickup",
    [ShipmentStatus.PICKED_UP]: "Picked Up",
    [ShipmentStatus.IN_TRANSIT]: "In Transit",
    [ShipmentStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
    [ShipmentStatus.DELIVERED]: "Delivered",
    [ShipmentStatus.CANCELLED]: "Cancelled",
  }
  return statusLabels[status] || "Unknown"
}

export const calculateEstimatedDelivery = (weight: number, distance?: number): Date => {
  // Simple estimation logic - can be enhanced with real logistics data
  const baseDeliveryDays = 2
  const weightFactor = weight > 10 ? 1 : 0
  const distanceFactor = distance ? Math.ceil(distance / 500) : 1

  const estimatedDays = baseDeliveryDays + weightFactor + distanceFactor
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDays)

  return estimatedDate
}

export const formatTrackingNumber = (trackingNumber: string): string => {
  // Format: CS-XXXXXXXX-XXXX
  if (trackingNumber.length >= 12) {
    return `${trackingNumber.slice(0, 2)}-${trackingNumber.slice(2, 10)}-${trackingNumber.slice(10)}`
  }
  return trackingNumber
}

export const validateShipmentTransition = (currentStatus: ShipmentStatus, newStatus: ShipmentStatus): boolean => {
  const validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
    [ShipmentStatus.PENDING]: [ShipmentStatus.PICKED_UP, ShipmentStatus.CANCELLED],
    [ShipmentStatus.PICKED_UP]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.CANCELLED],
    [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.CANCELLED],
    [ShipmentStatus.OUT_FOR_DELIVERY]: [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED],
    [ShipmentStatus.DELIVERED]: [], // Final state
    [ShipmentStatus.CANCELLED]: [], // Final state
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}
