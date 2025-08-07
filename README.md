# ProductOwl 🦉

A full-stack web application for tracking Amazon product prices and getting notified when prices drop. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Smart Price Tracking**: Scrape Amazon product data including images, titles, and prices
- **Email Notifications**: Get notified when prices drop by 30% or more
- **Real-time Updates**: Daily CRON jobs check for price changes


## 🛠️ Tech Stack

### Frontend
- React js 

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Puppeteer** for web scraping
- **SendGrid** for email notifications
- **Node-Cron** for scheduled tasks

## 🚀 Quick Start

### Prerequisites
- Node.js
- MongoDB 
- Gmail account for email notifications

Demo
<img width="1906" height="923" alt="Screenshot 2025-08-07 163618" src="https://github.com/user-attachments/assets/cc2ec17d-d872-409f-9d95-0c3425de9f01" />
<img width="1895" height="920" alt="Screenshot 2025-08-07 163636" src="https://github.com/user-attachments/assets/f411ebdb-0131-406a-ae57-d5a945cfa9fe" />


### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProductOwl
   ```

2. **Install dependencies for both client and server**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env 
   ```
   
      #### MongoDB connection string
      MONGODB_URI=your_mongodb_connection_string_here
      
      #### SendGrid email settings
      EMAIL_USER=your_email@example.com
      SENDGRID_API_KEY=your_sendgrid_api_key_here
      
      #### JWT Secret for authentication
      JWT_SECRET=your_secure_jwt_secret_key
      
      #### Frontend environment (in /client/.env)
      VITE_API_URL=http://localhost:5000/api


## 📧 Email Setup

To enable email notifications, you need to:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update your `.env` file** with the app password
4. or use sendgrid email

## 🎯 Usage

### Adding Products
1. Navigate to the homepage
2. Paste an Amazon product URL in the search bar
3. Click "Track Product" to scrape and store the product

### Tracking Prices
1. Click on any product card to view details
2. Click "Track Price" button
3. Enter your email address
4. You'll receive notifications when prices drop by 40% or more

### Viewing Product Details
- **Product Image**: High-quality product image
- **Product Title**: Full product name
- **Current Price**: Latest price with discount indicators
- **Price Analysis**: Four cards showing current, average, highest, and lowest prices
- **Visit Product**: Direct link to Amazon product page

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
- `DELETE /api/tracking/:id` - Delete tracking subscription

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

## 🔄 CRON Jobs

The application runs daily price checks at 9 AM (IST):
- Scrapes current prices for all tracked products
- Updates price history and statistics
- Sends email notifications for significant price drops (≥40%)

## 📝 License

This project is licensed under the MIT License.


author: Nithesh G
