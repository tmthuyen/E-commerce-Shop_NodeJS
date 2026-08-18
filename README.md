# E-Commerce Shop - Node.js & React.js

This is a full-stack e-commerce application built with NodeJS for the backend and ReactJS for the frontend.

# Tech Stack

- Frontend: React.js, Redux, React Router, Axios, Material-UI, Ant Design
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, WebSocket
- DevOps: Docker, Docker Compose, GitHub Actions

# Features

- Authentication & Authorization
- User Management
- Catalog Management
- Shopping Cart
- Order Processing
- Promotions & Discounts
- Payment Integration
- Comment & Rating System
- Notification for Admin
- Admin Dashboard

# Project Structure

## The main modules

- .github: Contains GitHub configuration files, such as workflows for CI/CD.
- client: Contains the ReactJS frontend code.
- docker: Contains Docker configuration files, including Dockerfiles and docker-compose files for development and production.
- server: Contains the NodeJS backend code.
- docs: Contains documentation files related to the project.

## Structure folder server

```text
server/
|-- src
|  |-- app                # Core application logic (controllers, middlewares, models)
|  |  |-- controllers
|  |  |-- middlewares
|  |  |-- models
|  |-- assets             # Static assets
|  |-- config
|  |  |-- cloudinary      # Cloudinary configuration
|  |  |-- database        # Database connection configuration
|  |  |-- multer          # Multer configuration for file uploads
|  |-- constants          # App constants
|  |-- lib                # Low-level libraries and helpers (e.g., Elasticsearch client, index initialization)
|  |-- public
|  |-- routes             # Routes and Endpoints
|  |-- security           # Rate limiting
|  |-- services           # Service layer (notifications, search, payment)
|  |-- sockets            # Socket.IO event handlers
|  |-- uploads            # Uploaded files (avatars, portfolio, products)
|  |  |-- products
|  |-- utils              # Utility functions
|-- tests                 # Unit testing
|  |-- controllers
|  |-- security
|-- .env.example          # Example environment variables
|-- package.json           # Node.js package configuration
|-- package-lock.json      # Node.js package lock file
|-- README.md              # This documentation file

```

## Structure folder client

```
|-- public                    # Public folder for static files
|-- src                       # Main frontend source code
|  |-- api                    # API service layer (axios, fetch, etc.)
|  |-- components             # Reusable UI components
|  |  |-- admin              # Admin-specific components
|  |  |  |-- Brand           # Brand management UI
|  |  |  |-- Category        # Category management UI
|  |  |  |-- Navigation      # Admin navigation UI
|  |  |  |-- Notification    # Admin notification UI
|  |  |  |-- Partials        # Shared admin partials
|  |  |  |-- Product         # Product management UI
|  |  |-- common             # Shared components for all roles
|  |  |  |-- LogoutButton    # Logout action component
|  |  |  |-- product         # Shared product-related widgets
|  |  |-- customer           # Customer-facing components
|  |  |  |-- Menu            # Customer menu components
|  |  |-- ForgotPasswordDialog # Forgot password dialog
|  |-- config                 # App configuration (theme, setup)
|  |-- constants              # Constant values and enums
|  |-- context                # React context providers
|  |-- hooks                  # Custom React hooks
|  |-- layouts                # Page layout wrappers
|  |  |-- AdminLayout         # Layout for admin pages
|  |  |-- CustomerLayout      # Layout for customer pages
|  |  |-- LayoutDefault       # Default shared layout
|  |-- pages                  # Route-level pages
|  |  |-- admin               # Admin page modules
|  |  |  |-- Brand            # Brand admin pages
|  |  |  |-- Category         # Category admin pages
|  |  |  |-- Customer         # Customer admin pages
|  |  |  |-- Dashboard        # Dashboard pages
|  |  |  |-- Notification     # Notification pages
|  |  |  |-- Order            # Order admin pages
|  |  |  |-- Product          # Product admin pages
|  |  |  |-- Promotion        # Promotion admin pages
|  |  |  |-- Report           # Reporting pages
|  |  |  |-- Setting          # Settings pages
|  |  |-- auth                # Authentication pages
|  |  |  |-- Login            # Login page
|  |  |  |-- Logout           # Logout page
|  |  |  |-- Register         # Register page
|  |  |-- customer            # Customer page modules
|  |  |  |-- About            # About page
|  |  |  |-- Account          # Account area pages
|  |  |  |-- Cart             # Cart pages
|  |  |  |-- Category         # Category browsing pages
|  |  |  |-- Checkout         # Checkout pages
|  |  |  |-- Contact          # Contact page
|  |  |  |-- Favorite         # Favorites pages
|  |  |  |-- home             # Home page modules
|  |  |  |-- Order            # Customer order pages
|  |  |  |-- Payment          # Payment pages
|  |  |  |-- Product          # Customer product pages
|  |  |  |-- Profile          # Profile pages
|  |  |  |-- Skeleton         # Loading skeleton pages
|  |  |-- ErrorPage           # Error display page
|  |  |-- reset-password      # Password reset pages
|  |-- redux                  # Global state management
|  |  |-- actions             # Redux actions
|  |  |-- reducers            # Redux reducers
|  |-- routes                 # Route definitions and guards
|  |-- sockets                # Realtime socket client logic
|  |-- utils                  # Shared utility functions
```

# Run with Docker

The current folder: root

- Start the project in development mode:

```bash
docker-compose -p ecm-nodejs --env-file .env -f docker/docker-compose.dev.yml up --build -d
```

- Start the project in production mode:

```bash
docker-compose -p ecm-nodejs --env-file .env -f docker/docker-compose.prod.yml up --build -d
```

# Check server status

```bash
docker ps
```

- Access the frontend at: http://localhost:4000
- Access the backend API at: http://localhost:8080/api/health
