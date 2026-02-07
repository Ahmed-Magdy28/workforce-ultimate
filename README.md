# Employee & Project Management Platform (Frontend)

A modern web application inspired by Jira and ClickUp, designed to help managers
track employees, projects, tasks, schedules, and performance through a
role-based dashboard system.

This repository contains the **frontend application** built with React and
TypeScript, following scalable architecture and best practices.

---

## 🚀 Tech Stack

### Core
- **React + TypeScript**
- **Tailwind CSS**
- **Redux Toolkit**
- **TanStack React Query**

### Forms & Validation
- **React Hook Form**
- **Zod**

### UI & UX
- **Charts Library**
- **Drag & Drop**
- **Toast Notifications**
- **Role-Based Route Protection**

### Utilities
- **Date & Time Handling Library**
- **Centralized Error Handling Layer**

---

## 🧠 Architecture Overview

The application follows a **separation of concerns** approach:

- **Redux Toolkit**  
  Used for global application state such as:
  - Authentication
  - Current user
  - Roles & permissions

- **React Query**  
  Handles:
  - Server state
  - Data fetching & caching
  - Background refetching
  - Loading & error states

- **Local State (useState / useReducer)**  
  Used only for UI-specific logic.

---

## 🔐 Role-Based Access Control (RBAC)

The system supports multiple roles:
- Employee
- Manager
- Senior Manager
- Regional Manager
- HR

Each role has:
- Route-level protection
- UI-level permission rendering
- Feature-level access control

---

## 📊 Dashboards

### Employee Dashboard
- Daily tasks overview
- Change logs from previous day
- Manager satisfaction score
- Team satisfaction score

### Manager Dashboard
- Project tracking
- Employee performance overview
- Task timelines
- Productivity analytics

---

## 📋 Features

- Project management with task grouping
- Task prioritization and scheduling
- Time estimation and approval workflow
- Notifications system
- Daily work logs
- File uploads and integrations
- Performance scoring system
- Bonus and warning tracking
- Team chat
- Charts and analytics
- Drag & drop task organization

---

## 🧪 Error Handling Strategy

- Centralized error handler
- API error normalization
- User-friendly toast notifications
- Graceful fallback UI states

---

## 🛠️ Future Enhancements

- Mobile-first version
- Dedicated backend service
- Advanced analytics
- Offline-first support
- Real-time updates

---

## 👨‍💻 Author

Ahmed Magdy  
Frontend / Full-Stack Developer
