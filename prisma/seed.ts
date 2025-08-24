import { PrismaClient, Role, ShipmentStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@courier.com" },
    update: {},
    create: {
      email: "admin@courier.com",
      password: adminPassword,
      name: "Admin User",
      phone: "+1234567890",
      address: "123 Admin Street, Admin City, AC 12345",
      role: Role.ADMIN,
    },
  })

  // Create test user
  const userPassword = await bcrypt.hash("user123", 12)
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: userPassword,
      name: "John Doe",
      phone: "+1987654321",
      address: "456 User Avenue, User City, UC 54321",
      role: Role.USER,
    },
  })

  // Create sample shipments
  const shipment1 = await prisma.shipment.create({
    data: {
      trackingNumber: "CS202412011234",
      senderName: user.name,
      senderAddress: user.address,
      recipientName: "Jane Smith",
      recipientAddress: "789 Recipient Road, Recipient City, RC 98765",
      weight: 2.5,
      dimensions: "30x20x15 cm",
      description: "Electronics package",
      status: ShipmentStatus.IN_TRANSIT,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      userId: user.id,
    },
  })

  const shipment2 = await prisma.shipment.create({
    data: {
      trackingNumber: "CS202412015678",
      senderName: user.name,
      senderAddress: user.address,
      recipientName: "Bob Johnson",
      recipientAddress: "321 Delivery Lane, Delivery Town, DT 13579",
      weight: 1.2,
      dimensions: "25x15x10 cm",
      description: "Documents",
      status: ShipmentStatus.DELIVERED,
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      actualDelivery: new Date(),
      userId: user.id,
    },
  })

  // Create tracking history
  await prisma.shipmentTracking.createMany({
    data: [
      {
        shipmentId: shipment1.id,
        status: ShipmentStatus.PENDING,
        description: "Shipment created and pending pickup",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        shipmentId: shipment1.id,
        status: ShipmentStatus.PICKED_UP,
        location: "Origin Facility",
        description: "Package picked up from sender",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        shipmentId: shipment1.id,
        status: ShipmentStatus.IN_TRANSIT,
        location: "Transit Hub",
        description: "Package in transit to destination",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        shipmentId: shipment2.id,
        status: ShipmentStatus.PENDING,
        description: "Shipment created and pending pickup",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        shipmentId: shipment2.id,
        status: ShipmentStatus.PICKED_UP,
        location: "Origin Facility",
        description: "Package picked up from sender",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        shipmentId: shipment2.id,
        status: ShipmentStatus.DELIVERED,
        location: "Destination",
        description: "Package delivered successfully",
        timestamp: new Date(),
      },
    ],
  })

  console.log("✅ Database seeded successfully!")
  console.log("👤 Admin user: admin@courier.com / admin123")
  console.log("👤 Test user: user@test.com / user123")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
