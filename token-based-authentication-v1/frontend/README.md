# Automated Students Clearance System

## Overview
The Automated Students Clearance System is a web application built with **React**, **Vite**, and **TypeScript** to streamline the student clearance process in educational institutions. It provides role-based access for admins, clearing officers, and students, enabling efficient management of clearance requests, approvals, and status tracking. The application uses modern authentication mechanisms to secure user access.

This README focuses on the authentication-related components: `authContext.tsx`, `Login`, and `Register`.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Authentication Overview](#authentication-overview)
  - [AuthContext](#authcontext)
  - [Login Component](#login-component)
  - [Register Component](#register-component)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
- **Node.js**: Version 18.x or higher
- **npm** or **yarn**: For package management
- **Git**: For version control
- **Backend API**: A compatible backend API (e.g., Node.js/Express, Firebase) for authentication and data management
- **TypeScript**: For type-safe development
- **ESLint**: Configured with TypeScript and React-specific rules

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/anthonyc-dev/my-template.git
   cd my-template/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add necessary configurations, such as:
   ```
   VITE_API_URL=http://your-backend-api-url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

## Project Structure
```
Automated-students-clearance-system/
├── src/
│   ├── authentication/
│   │   ├── authContext.tsx
│   ├── components/
│   │   ├── ProtectedRoutes.tsx
│   ├── pages/
│   │   ├── auth/
│   │   ├──── Login.tsx
│   │   ├──── Register.tsx
│   ├── App.tsx
│   ├── main.tsx
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
├── .env
├── README.md
```

## Authentication Overview

### AuthContext
The `authContext.tsx` file provides a React Context for managing authentication state across the application. It handles user sessions, role-based access, and authentication-related API calls.

**Key Features**:
- Stores user data (e.g., email, role, token).
- Provides methods for login, logout, and checking authentication status.
- Supports role-based access control (admin, clearing officer, student).
- Persists authentication state using browser storage (e.g., localStorage).

**Example Usage**:
```tsx
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
```

**Code** (assumed structure):
```tsx
import axiosInstance from "@/api/axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Context type
interface AuthContextType {
  accessToken: string | null;
  role?: string;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (
    studentId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken") || null
  );
  const [role, setRole] = useState<string | undefined>(
    () => localStorage.getItem("role") || undefined
  );
  const [loading, setLoading] = useState(false);

  // Login
  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const token = res.data.accessToken;
    const userRole = res.data.user?.role;

    setAccessToken(token);
    setRole(userRole);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);

    console.log("Access Token:", token);

    console.log("Login successful, role:", userRole);
  };

  // Register
  const registerUser = async (
    studentId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      await axiosInstance.post("/auth/register", {
        studentId,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: "clearingOfficer" as const,
      });
    } catch (err: any) {
      const { status } = err.response || {};
      if (status === 400) {
        toast.error(err?.response?.data?.message || "Registration failed.");
      }
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setAccessToken(null);
    setRole(undefined);
    localStorage.clear();
  };

  // Refresh token on mount
  const refreshAccessToken = async () => {
    try {
      const res = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      const token = res.data.accessToken;
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    } catch (err) {
      setAccessToken(null);
      localStorage.clear();
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  // Auto-attach token to requests interceptors
  useEffect(() => {
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // ⛔ Don't retry on login or register failure
        if (
          originalRequest.url.includes("/auth/login") ||
          originalRequest.url.includes("/auth/register")
        ) {
          return Promise.reject(error);
        }

        // Prevent infinite retry loop
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const res = await axios.post(
              "/auth/refresh-token",
              {},
              { withCredentials: true }
            );

            const newAccessToken = res.data.accessToken;
            setAccessToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);

            // Set new token in header and retry request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            await logout();
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
            window.location.reload();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(responseIntercept);
  }, [accessToken]);

  console.log("AuthProvider initialized with accessToken:", accessToken);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        registerUser,
        logout,
        role,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

```

### Login Component
The `Login.tsx` component provides a form for users to authenticate with their credentials. It supports login for admins, clearing officers, and students.

**Key Features**:
- Form validation for email and password.
- Error handling for failed login attempts.
- Integration with `AuthContext` for state management.
- Responsive design using Tailwind CSS.

**Example**:
```tsx
import { useAuth } from "@/authentication/AuthContext";
//import...

export default function Login() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { login, role } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError("");

    try {
      await login(data.email, data.password);

      setIsSuccessModalVisible(true);
    } catch (error: any) {
      if (error.response) {
        const { status } = error.response;

        if (status === 401 || status === 404 || status === 400) {
          setError(
            error.response.data?.error || "Wrong credentials. Please try again."
          );
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
     {*/code...*/}
    </div>
  );
}

```

### Register Component
The `Register.tsx` component allows new users (primarily students) to create accounts. Admins and clearing officers may have restricted registration managed by the backend.

**Key Features**:
- Form validation for email, password, and additional fields (e.g., role).
- Integration with `AuthContext` for registration logic.
- Responsive design with Tailwind CSS.

**Example**:
```tsx
import { useAuth } from "@/authentication/AuthContext";
//import...

export default function Register() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { registerUser, role } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setError("");
    try {
      await registerUser(
        data.studentId,
        data.firstName,
        data.lastName,
        data.email,
        data.phoneNumber,
        data.password
      );
      setIsSuccessModalVisible(true);
      reset();
    } catch (error: any) {
      if (error?.response) {
        const { status } = error.response;
        if (status === 400) {
          setError(
            error.response.data?.error ||
              "Registration failed. Please try again later."
          );
        } else {
          setError("Registration failed. Please try again later.");
        }
      } else if (error?.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValue = watch("password");

  return (
    <div className="min-h-screen flex">
      {*/code...*/}
    </div>
  );
}

```

## Usage
1. **Access the Application**:
   - Open the app in your browser (e.g., `http://localhost:5173` for development).
   - Use the provided credentials for testing:
     - **Admin**: `anthony.dev@gmail.com` / `Anthony@123`
     - **Clearing Officer**: `cawasa@gmail.com` / `Cawasa@123`
     - **Student**: `marjoe@gmail.com` / `Marjoe@123`

2. **Login**:
   - Navigate to the login page.
   - Enter credentials and submit to access role-specific dashboards.

3. **Register**:
   - Navigate to the registration page.
   - Fill in the required fields (email, password, role) to create a new account.

4. **Role-Based Features**:
   - **Admin**: Manage users, view all clearance requests, and approve/reject requests.
   - **Clearing Officer**: Review and process clearance requests for specific departments.
   - **Student**: Submit clearance requests and track their status.

## Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License
© 2025 GitHub, Inc. All rights reserved.
