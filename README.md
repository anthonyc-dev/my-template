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
