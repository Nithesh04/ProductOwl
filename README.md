# ProductOwl 🦉

A full-stack web application for tracking Amazon product prices and getting notified when prices drop. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Smart Price Tracking**: Scrape Amazon product data including images, titles, and prices
- **Price History**: Maintain comprehensive price history with highest, lowest, and average prices
- **Email Notifications**: Get notified when prices drop by 30% or more
- **Modern UI**: Clean, dark-themed interface with responsive design
- **Real-time Updates**: Daily CRON jobs check for price changes
- **Email Notifications**: Get notified when prices drop by 30% or more
- **Real-time Updates**: Daily CRON jobs check for price changes



## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Styled Components** for modern styling
- **React Router** for navigation
- **React Icons** for beautiful icons
- **Framer Motion** for smooth animations
=======
- React js 
>>>>>>> 3dcca28936621dc0e4e51a24817028ac915b02e2

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Puppeteer** for web scraping
- **SendGrid** for email notifications
- **Node-Cron** for scheduled tasks


Demo
<img width="1906" height="923" alt="Screenshot 2025-08-07 163618" src="https://github.com/user-attachments/assets/cc2ec17d-d872-409f-9d95-0c3425de9f01" />

<img width="1895" height="920" alt="Screenshot 2025-08-07 163636" src="https://github.com/user-attachments/assets/f411ebdb-0131-406a-ae57-d5a945cfa9fe" />

<img width="1917" height="925" alt="Screenshot 2025-08-11 222513" src="https://github.com/user-attachments/assets/84abfe93-4f26-4e0c-97b7-2e8be608c7f5" />

###.env file
   
      #### MongoDB connection string
      MONGODB_URI=your_mongodb_connection_string_here
      
      #### SendGrid email settings
      EMAIL_USER=your_email@example.com
      SENDGRID_API_KEY=your_sendgrid_api_key_here
      
      #### JWT Secret for authentication
      JWT_SECRET=your_secure_jwt_secret_key
      
      #### Frontend environment (in /client/.env)
      VITE_API_URL=http://localhost:5000/api



## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products/scrape` - Scrape and add new product
- `PUT /api/products/:id/price` - Update product price
- `DELETE /api/products/:id` - Delete product

### Tracking
- `POST /api/tracking/subscribe` - Subscribe to price alerts
- `GET /api/tracking/user/:email` - Get user's tracking subscriptions

## 📊 Database Schema

### Product Model
```javascript
{
  amazonUrl: String,
  title: String,
  imageUrl: String,
  currentPrice: Number,
  originalPrice: Number,
  highestPrice: Number,
  lowestPrice: Number,
  averagePrice: Number,
  priceHistory: [{
    price: Number,
    date: Date
  }],
  createdAt: Date,
  lastUpdated: Date
}
```

### Tracking Model
```javascript
{
  email: String,
  productId: ObjectId,
  originalPrice: Number,
  isActive: Boolean,
  createdAt: Date,
  lastNotified: Date
}
```
### User Model
```
{
  email: String,
  password: String,
  name: String,
  isEmailVerified: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

## 🔄 CRON Jobs

The application runs daily price checks at 7 AM (IST):
- Scrapes current prices for all tracked products
- Updates price history and statistics
- Sends email notifications for significant price drops (≥30%)


