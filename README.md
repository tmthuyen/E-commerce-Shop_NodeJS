# E-Commerce Shop - Node.js & React
This is a full-stack e-commerce application built with NodeJS for the backend and ReactJS for the frontend.


# Project Structure

## The main modules
- .github: Contains GitHub configuration files, such as workflows for CI/CD.
- client: Contains the ReactJS frontend code.
- docker: Contains Docker configuration files, including Dockerfiles and docker-compose files for development and production.
- server: Contains the NodeJS backend code.
- docs: Contains documentation files related to the project.

## Structure folder server

```
Structure folder server
```
## Structure folder client
```
Structure folder client
```

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


# Tech Stack
- Frontend: React.js, Redux, React Router, Axios, Material-UI, Ant Design
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, WebSocket
- DevOps: Docker, Docker Compose, GitHub Actions

# Start the project

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
