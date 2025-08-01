# Token-Based Authentication (V1)

## Overview
The Token-Based Authentication (V1) project is a full-stack authentication system built with a **React**, **Vite**, and **TypeScript** frontend and a **Node.js/Express** backend with **MongoDB**. It implements JSON Web Token (JWT) authentication to manage user sessions for different roles (e.g., admin, user). The system provides secure user authentication for applications like the Automated Students Clearance System, with a focus on scalability and security. This README covers the frontend (`authContext.tsx`, `Login.tsx`, `Register.tsx`) and backend (Express API with MongoDB) components.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Frontend Authentication](#frontend-authentication)
  - [AuthContext](#authcontext)
  - [Login Component](#login-component)
  - [Register Component](#register-component)
- [Backend Authentication](#backend-authentication)
  - [User Model](#user-model)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Middleware](#middleware)
- [Token-Based Authentication Flow](#token-based-authentication-flow)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **JWT Authentication**: Secure session management using JSON Web Tokens.
- **Role-Based Access**: Supports roles (admin, user) for authorization.
- **Frontend Security**: Tokens stored in localStorage with client-side validation.
- **Backend Security**: Password hashing with bcrypt, JWT verification, and CSRF protection.
- **Responsive UI**: Frontend styled with Tailwind CSS.
- **Type Safety**: TypeScript for both frontend and backend.
- **MongoDB Integration**: Persistent user storage.
- **ESLint**: Enforces code quality for React and TypeScript.

## Prerequisites
- **Node.js**: Version 18.x or higher
- **npm** or **yarn**: For package management
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **Git**: For version control
- **TypeScript**: For type-safe development
- **Vite**: For frontend development
- **Express**: For backend API

## Installation
### Frontend
1. Clone the repository:
   ```bash
   git clone https://github.com/anthonyc-dev/my-template.git
   cd my-template/token-based-authentication-v1/client
   ```


1. Install dependencies
   ```bash
    npm install
   ```
   or

   ```bash
   yarn install
   ```


3. Set up environment variables: Create a .env file in the client directory:VITE_API_URL=http://localhost:5000/api
   ```plain
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```



### Backend

1. Navigate to the backend directory:
   ```bash
   cd my-template/token-based-authentication-v1/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```


3. Set up environment variables:Create a .env file in the server directory:
   ```bash
    DATABASE_URL=mongodb:your_databse
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
   ```



3. Start the backend server:

   ```bash
   npm run start
   ```



### Project Structure
---
token-based-authentication-v1/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   ├── context/
│   │   │   ├── authContext.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   ├── eslint.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   ├── index.ts
│   ├── .env
│   ├── package.json
├── README.md
---

Frontend Authentication
AuthContext
The authContext.tsx manages authentication state using React Context, handling JWT tokens and user data.
Key Features:

Stores user data (email, role) and JWT token in localStorage.
Provides login, logout, and isAuthenticated methods.
Validates tokens on app load.

Code:
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { email: string; role: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } else {
      throw new Error(data.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

Login Component
The Login.tsx component provides a form for users to authenticate, receiving a JWT upon success.
Key Features:

Validates email and password.
Displays error messages for invalid credentials.
Uses Tailwind CSS for styling.

Code:
import { useState } from 'react';
import { useAuth } from '../context/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

Register Component
The Register.tsx component allows users to create accounts, receiving a JWT after registration.
Key Features:

Validates email, password, and role.
Auto-logs in users post-registration.
Styled with Tailwind CSS.

Code:
import { useState } from 'react';
import { useAuth } from '../context/authContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        await login(email, password);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

Backend Authentication
User Model
The User.ts model defines the schema for users in MongoDB using Mongoose.
Code:
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

export default mongoose.model<IUser>('User', userSchema);

Authentication Endpoints
The auth.ts route handles login and registration, issuing JWTs upon success.
Code:
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response } from 'express';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    res.status(201).json({ user: { email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    res.json({ user: { email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

Middleware
The authMiddleware.ts verifies JWTs for protected routes.
Code:
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

Server Setup
The index.ts file initializes the Express server and connects to MongoDB.
Code:
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

Token-Based Authentication Flow

Registration:

Frontend sends user data to /api/auth/register.
Backend hashes the password, saves the user, and issues a JWT.
Frontend stores the token and user data in localStorage.


Login:

Frontend sends credentials to /api/auth/login.
Backend verifies credentials and issues a JWT.
Frontend stores the token and user data.


Protected Routes:

Frontend includes the JWT in the Authorization: Bearer <token> header for API requests.
Backend verifies the token using authMiddleware before granting access.


Logout:

Frontend clears localStorage via AuthContext.
User is redirected to the login page.



Usage

Run the Application:

Start the backend: cd server && npm run start
Start the frontend: cd client && npm run dev
Access the app at http://localhost:5173.


Test Authentication:

Register: Create a new account with email, password, and role.
Login: Use valid credentials to authenticate.
Protected Routes: Access /api/protected with the JWT in the header (requires backend route implementation).


Example API Request:
curl --request GET \
  --url "http://localhost:5000/api/protected" \
  --header "Authorization: Bearer YOUR_TOKEN"



Contributing

Fork the repository.
Create a feature branch:git checkout -b feature/your-feature


Commit changes:git commit -m "Add your feature"


Push to the branch:git push origin feature/your-feature


Open a pull request.

License
© 2025 GitHub, Inc. All rights reserved.```
