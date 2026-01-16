# ShopHub Backend API

A comprehensive REST API for the ShopHub E-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access
- **Product Management** - Full CRUD operations for products
- **Shopping Cart** - Persistent cart with inventory management
- **Order Processing** - Complete order lifecycle management
- **Admin Dashboard** - User and product management for administrators
- **Security** - Helmet, rate limiting, input validation
- **Data Seeding** - Automated data import from FakeStore API

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **MongoDB Setup**
   - **Option 1: MongoDB Atlas (Cloud)**
     - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
     - Create a cluster and get connection string
     - Update `MONGODB_URI` in `.env`

   - **Option 2: Local MongoDB**
     - Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
     - Start MongoDB service
     - Default connection should work

4. **Environment Setup**
   - Copy `.env` file and update the values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/shophub
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```
   This will create an admin user and import products from FakeStore API.

6. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=clothing&search=laptop
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin only)
```http
POST /api/products
Authorization: Bearer <token>
```

### Cart Endpoints

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add Item to Cart
```http
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "60d5ecb74b24c72b8c8b4567",
  "quantity": 2
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "60d5ecb74b24c72b8c8b4567",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "123-456-7890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  },
  "paymentMethod": "card"
}
```

## 🗂️ Project Structure

```
backend/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── seeder.js       # Database seeding script
├── server.js       # Main server file
├── .env            # Environment variables
└── package.json    # Dependencies
```

## 🔐 Default Admin Credentials

After seeding the database, you can login with:
- **Email**: admin@shophub.com
- **Password**: admin123

## 🧪 Testing

```bash
npm test
```

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm run seed -d` - Destroy all data
- `npm test` - Run tests

## 🔒 Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- Role-based access control

## 🚀 Deployment

1. Set `NODE_ENV=production` in environment
2. Update MongoDB URI for production database
3. Set strong JWT secret
4. Configure proper CORS origins
5. Use process manager like PM2 in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.