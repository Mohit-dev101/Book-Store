# 📚 BookMart - E-Commerce Platform

BookMart is a full-stack, multi-role e-commerce web application designed as a marketplace specifically tailored for buying and selling books. It features role-based access control, secure authentication, and separate interfaces for buyers, sellers, and administrators.

## 🚀 Key Features

*   **Multi-Role System:** Distinct dashboards and functionalities for **Buyers**, **Sellers**, and **Admins**.
*   **Secure Authentication:** User registration and login utilizing JWT (JSON Web Tokens) and secure password hashing with `bcryptjs`.
*   **Book Catalog:** Comprehensive browsing and searching capabilities for listed books.
*   **Shopping Cart:** Persistent, easy-to-use cart management for buyers preparing to checkout.
*   **Inventory Management:** Sellers can post, edit, and remove their own book listings.
*   **Admin Dashboard:** Platform moderators can view total platform statistics and manage user access (e.g., elevate normal users to administrators).

## 🛠️ Technology Stack

This application is built using the **MERN** stack:

### Frontend
*   **React.js (v18)** - Component-based user interface.
*   **Vite** - High-performance build tool and dev server.
*   **React Router (v6)** - Client-side page navigation.
*   **React Context API** - Global state management for sessions and shopping carts.
*   **Vanilla CSS** - Custom styling system.

### Backend
*   **Node.js & Express.js (v5)** - RESTful API server.
*   **MongoDB & Mongoose (v9)** - NoSQL database and Object Data Modeling.
*   **Security:** `jsonwebtoken` (JWT), `bcryptjs`, and CORS.

## 📂 Project Structure

```text
AWT_PROJECT/
├── backend/                  # Node.js + Express backend server
│   ├── models/               # Mongoose database schemas
│   ├── routes/               # API route definitions (auth, products, cart, admin)
│   ├── middleware/           # Custom Express middleware (e.g., auth verification)
│   ├── server.js             # Main backend application entry point
│   ├── makeAdmin.js          # Utility script for admin role assignment
│   └── package.json          # Backend dependencies
└── frontend/                 # React frontend application
    ├── src/                  
    │   ├── components/       # Reusable React components
    │   ├── context/          # State management context providers
    │   ├── pages/            # Page components (Home, Login, admin/, buyer/, seller/)
    │   ├── App.jsx           # Main generic layout and routing
    │   ├── main.jsx          # React DOM mounting
    │   └── index.css         # Global stylesheets
    ├── vite.config.js        # Vite configuration
    └── package.json          # Frontend dependencies
```

## 🏁 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/en/) installed on your local machine.
*   [MongoDB](https://www.mongodb.com/) installed locally or a MongoDB Atlas connection string.

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Ensure there is a `.env` file in the `backend` directory containing your MongoDB connection string and JWT Secret:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        PORT=5000
        ```
4.  Start the development server (uses nodemon):
    ```bash
    npm start
    ```

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
4.  The application should now be accessible in your web browser (usually at `http://localhost:5173`).

## 🔑 Administrative Access

To convert a standard user into an administrator for testing the Admin Dashboard:
1. Ensure the user has registered their account normally.
2. You can use the dedicated script in the backend directory (check `backend/makeAdmin.js` for execution instructions) or modify the user's role directly within your MongoDB client.
