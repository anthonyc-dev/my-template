Automated Students Clearance System
Overview
The Automated Students Clearance System is a web application built with React, Vite, and TypeScript to streamline the student clearance process in educational institutions. It provides role-based access for admins, clearing officers, and students, enabling efficient management of clearance requests, approvals, and status tracking. The application uses modern authentication mechanisms to secure user access.
This README focuses on the authentication-related components: authContext.tsx, Login, and Register.
Table of Contents

Prerequisites
Installation
Project Structure
Authentication Overview
AuthContext
Login Component
Register Component


Usage
Contributing
License

Prerequisites

Node.js: Version 18.x or higher
npm or yarn: For package management
Git: For version control
Backend API: A compatible backend API (e.g., Node.js/Express, Firebase) for authentication and data management
TypeScript: For type-safe development
ESLint: Configured with TypeScript and React-specific rules

Installation

Clone the repository:git clone https://github.com/anthonyc-dev/Automated-students-clearance-system.git
cd Automated-students-clearance-system


Install dependencies:npm install

oryarn install


Set up environment variables:Create a .env file in the root directory and add necessary configurations, such as:VITE_API_URL=http://your-backend-api-url


Start the development server:npm run dev

oryarn dev



Project Structure
Automated-students-clearance-system/
├── src/
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   ├── context/
│   │   ├── authContext.tsx
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
├── .env
├── README.md

Authentication Overview
AuthContext
The authContext.tsx file provides a React Context for managing authentication state across the application. It handles user sessions, role-based access, and authentication-related API calls.
Key Features:

Stores user data (e.g., email, role, token).
Provides methods for login, logout, and checking authentication status.
Supports role-based access control (admin, clearing officer, student).
Persists authentication state using browser storage (e.g., localStorage).

Example Usage:
import { useAuth } from './context/authContext';

const App = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email} ({user.role})</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};

Code (assumed structure):
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    // Check for existing session (e.g., from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Replace with actual API call
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      throw new Error(data.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
The Login.tsx component provides a form for users to authenticate with their credentials. It supports login for admins, clearing officers, and students.
Key Features:

Form validation for email and password.
Error handling for failed login attempts.
Integration with AuthContext for state management.
Responsive design using Tailwind CSS.

Example:
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
The Register.tsx component allows new users (primarily students) to create accounts. Admins and clearing officers may have restricted registration managed by the backend.
Key Features:

Form validation for email, password, and additional fields (e.g., role).
Integration with AuthContext for registration logic.
Responsive design with Tailwind CSS.

Example:
import { useState } from 'react';
import { useAuth } from '../context/authContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Assuming registration auto-logs in

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        await login(email, password); // Auto-login after registration
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
          <option value="student">Student</option>
          {/* Admin and officer roles may be restricted */}
        </select>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

Usage

Access the Application:

Open the app in your browser (e.g., http://localhost:5173 for development).
Use the provided credentials for testing:
Admin: anthony.dev@gmail.com / Anthony@123
Clearing Officer: cawasa@gmail.com / Cawasa@123
Student: marjoe@gmail.com / Marjoe@123




Login:

Navigate to the login page.
Enter credentials and submit to access role-specific dashboards.


Register:

Navigate to the registration page.
Fill in the required fields (email, password, role) to create a new account.


Role-Based Features:

Admin: Manage users, view all clearance requests, and approve/reject requests.
Clearing Officer: Review and process clearance requests for specific departments.
Student: Submit clearance requests and track their status.



Contributing

Fork the repository.
Create a feature branch:git checkout -b feature/your-feature


Commit your changes:git commit -m "Add your feature"


Push to the branch:git push origin feature/your-feature


Open a pull request.

License
© 2025 GitHub, Inc. All rights reserved.
