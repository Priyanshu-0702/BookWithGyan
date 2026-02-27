# 📘 BookWithGyan – Event Seat Booking System

A full-stack Event Management and Seat Booking platform built using **.NET Core (Backend)**, **React (Frontend)** and **SQL Server (SSMS)**.

BookWithGyan enables organizations to create internal events, manage seat capacity, handle department-based restrictions, prevent overbooking, and provide waitlisting functionality with enterprise-grade architecture.

---

## 🚀 Live Features

### 👨‍💼 Admin (HR Role)

* Create events with seat limits
* Update events
* Activate / Deactivate events
* Department-based event restriction
* View event bookings
* Add employees
* View event seat utilization

### 👩‍💻 Employee

* View active events
* Book event seats
* Automatic waitlisting if full
* Cancel bookings
* View booking history
* First-time login password change

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Material UI
* Axios (with JWT Interceptor)
* Role-based routing
* Protected routes
* Clean modular structure

### Backend

* ASP.NET Core Web API
* Clean Layered Architecture:

  * Controllers
  * Services
  * Repositories
  * DTOs
  * Global Exception Handling
* JWT Authentication
* Concurrency-safe booking logic
* SQL Server (SSMS)

### Database

* SQL Server
* Transactions
* Unique constraints
* Concurrency-safe seat booking

---

## 🧠 Key Architectural Highlights

### 🔐 Secure Authentication

* JWT-based authentication
* Role-based authorization (ADMIN / EMPLOYEE)
* First-login password change enforcement
* Protected route system

### 🪑 Concurrency-Safe Seat Booking

* Prevents double booking
* Handles race conditions
* Maintains confirmed + waitlist status

### 🏢 Department-Based Event Restriction

Admin can:

* Restrict event to specific department
* Allow event for all employees

### 📩 Notification System

* Email simulation on:

  * Event creation
  * Successful booking
* Targeted department notifications

### 📊 Admin Dashboard

* Event seat utilization tracking
* Booking view per event
* Activate / Deactivate control

---

## 🔄 API Overview

### Authentication

* `POST /api/auth/login`
* `POST /api/auth/change-password`
* `GET /api/auth/me`
* `POST /api/auth/create-employee`

### Events

* `GET /api/events`
* `POST /api/admin/events`
* `PUT /api/admin/events/{id}`
* `PATCH /api/admin/events/{id}/activate`
* `PATCH /api/admin/events/{id}/deactivate`

### Bookings

* `POST /api/bookings/{eventId}`
* `DELETE /api/bookings/{eventId}`
* `GET /api/bookings/my`
* `GET /api/admin/events/{id}/bookings`

---

## ⚙️ Setup Instructions

### Backend Setup

```bash
cd backend
dotnet restore
dotnet run
```

Update `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=BookWithGyanDb;Trusted_Connection=True;"
}
```

Ensure:

* SQL Server running
* Database migrated

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Default Role System

| Role     | Access                  |
| -------- | ----------------------- |
| ADMIN    | Event & User Management |
| EMPLOYEE | Event Booking           |

---

## 🧩 Advanced Functionalities

* Concurrency handling for seat booking
* Waitlist queue management
* Department-level filtering
* Clean exception middleware
* JWT token persistence
* Role-based route guards
* Centralized Axios interceptor

---

## 📈 Scalability Considerations

* Clean architecture for maintainability
* Separation of concerns
* Transaction-safe DB operations
* Extensible notification service
* Ready for microservices refactor

---

 Deployment Guide

📄 Access Documentation Here:

👉 https://adam702-my.sharepoint.com/:w:/g/personal/sanket_rout_gyansys_com/IQC_JCUAF1lsRpzh3CTw0xf9AaVlHXRyyk3JoWNevEjyf_Y

---

## 🎯 Hackathon Value Proposition

BookWithGyan solves internal enterprise event booking challenges by:

* Eliminating manual email-based booking
* Preventing overbooking
* Enforcing department-level restrictions
* Ensuring concurrency-safe seat allocation
* Providing structured dashboards for HR and employees
