# Courier Service Backend

Express.js backend API for the courier service application with JWT authentication, role-based access control, and comprehensive shipment management.

## Features

- **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (USER/ADMIN)
  - Secure password hashing with bcrypt

- **Shipment Management**

  - Create and track shipments
  - Real-time status updates
  - Comprehensive tracking history

- **Admin Dashboard**

  - Manage all shipments
  - Update shipment statuses
  - View system statistics

- **Database**
  - PostgreSQL with Prisma ORM
  - Automated migrations
  - Database seeding

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Database setup**
   \`\`\`bash

   # Generate Prisma client

   npm run db:generate

   # Push database schema

   npm run db:push

   # Seed database with sample data

   npm run db:seed
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Shipments

- `POST /api/shipments` - Create shipment (protected)
- `GET /api/shipments` - Get user shipments (protected)
- `GET /api/shipments/track/:trackingNumber` - Track shipment (public)
- `GET /api/shipments/:id` - Get shipment details (protected)

### Admin

- `GET /api/admin/shipments` - Get all shipments (admin/user only)
- `PUT /api/admin/shipments/:id/status` - Update shipment status (admin/user only)
- `GET /api/admin/stats` - Get system statistics (admin/user only)

### Health Check

- `GET /api/health` - API health status

## Database Schema

### Users

- User authentication and profile information
- Role-based access (USER/ADMIN)

### Shipments

- Complete shipment information
- Tracking numbers and status
- Sender and recipient details

### Tracking Events

- Shipment status history
- Location and timestamp tracking
- Detailed event descriptions

## Scripts

\`\`\`bash

# Development

npm run dev # Start development server with hot reload
npm run build # Build for production
npm run start # Start production server

# Database

npm run db:generate # Generate Prisma client
npm run db:push # Push schema to database
npm run db:migrate # Run database migrations
npm run db:seed # Seed database with sample data
npm run db:studio # Open Prisma Studio
\`\`\`

## Default Users

After seeding, you can use these accounts:

**Admin Account:**

- Email: `admin@courier.com`
- Password: `admin123`

**Test User:**

- Email: `user@courier.com`
- Password: `user123`

## Environment Variables

| Variable         | Description                  | Default                 |
| ---------------- | ---------------------------- | ----------------------- |
| `DATABASE_URL`   | PostgreSQL connection string | Required                |
| `JWT_SECRET`     | JWT signing secret           | Required                |
| `JWT_EXPIRES_IN` | JWT expiration time          | `7d`                    |
| `PORT`           | Server port                  | `3001`                  |
| `NODE_ENV`       | Environment mode             | `development`           |
| `FRONTEND_URL`   | Frontend URL for CORS        | `http://localhost:3000` |

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing
- **Zod**: Input validation
- **Rate limiting**: API protection

## Development

### Project Structure

\`\`\`
backend/
├── src/
│ ├── controllers/ # Request handlers
│ ├── middleware/ # Express middleware
│ ├── routes/ # API routes
│ └── index.ts # Application entry point
├── prisma/
│ ├── schema.prisma # Database schema
│ └── seed.ts # Database seeding
└── package.json
\`\`\`

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Add routes in `src/routes/`
3. **Controllers**: Implement logic in `src/controllers/`
4. **Middleware**: Add middleware in `src/middleware/`

## Support

For issues and questions:

1. Check the API health endpoint: `/api/health`
2. Review server logs for errors
3. Verify database connectivity
4. Ensure environment variables are set correctly
