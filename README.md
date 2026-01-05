# Employee Management Dashboard

A modern, responsive React application for managing employee records. This dashboard allows HR administrators to view, add, edit, and delete employee data with a focus on clean UI/UX and performance.

## 📋 Project Overview

This project is an **Employee Management System** built with **React.js**. It features a secure login simulation, a dashboard with real-time statistics, and a comprehensive employee list with search, filtering, and print capabilities.

The application is designed to be **serverless-first** for this assignment, utilizing **Local Storage** for data persistence and the **RandomUser API** to auto-seed initial data, ensuring the application is never empty on the first load.

### Key Features
* **Authentication:** Secure-feel login page with validation.
* **Dashboard:** Visual statistics for Total, Active, and Inactive employees.
* **CRUD Operations:** Add, Edit, and Delete employees.
* **Smart Data Seeding:** Automatically fetches Indian user data from `randomuser.me` if local storage is empty.
* **Advanced UI:**
    * Dark-themed modals for data entry.
    * Skeleton loaders for data fetching states.
    * Responsive tables with sorting and filtering.
    * Custom confirmation modals (no native browser alerts).
* **Search & Filter:** Filter by Gender and Status; Search by Name.
* **Print Support:** CSS optimized for printing the employee list (hides sidebar/buttons).

---

## 🛠 Tech Stack

* **Frontend Framework:** React.js (Vite)
* **Styling:** Tailwind CSS (Utility-first CSS)
* **Routing:** React Router DOM (v6)
* **Icons:** Lucide React
* **State Management:** React `useState` & `useEffect` + Local Storage
* **Data Validation:** Custom inline validation (no external libraries)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v14 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd employee-dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (or the port shown in your terminal).

### 🔑 Login Credentials
To access the dashboard, use the following mock credentials:

* **Email:** `admin@admin.com`
* **Password:** `admin`

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── Layout.jsx           # Main Dashboard Shell (Sidebar/Header)
│   ├── ConfirmationModal.jsx # Reusable Delete Confirmation
│   └── EmployeeModal.jsx    # Add/Edit Form (Dark Theme)
├── pages/
│   ├── Login.jsx            # Auth Page
│   ├── Dashboard.jsx        # Stats Overview
│   └── EmployeeList.jsx     # Main Data Table
├── utils/
│   ├── storage.js           # LocalStorage wrapper (CRUD helper)
│   └── constants.js         # Static data (Indian States)
├── App.jsx                  # Routes & Auth Guard
└── main.jsx                 # Entry point


Design Decisions & Assumptions
Data Persistence (Local Storage):

Assumption: Since no backend was provided, localStorage is used to persist data across page reloads.

Feature: A utility layer (utils/storage.js) was created to abstract storage logic, making it easier to swap with a real API later.

Auto-Seeding Data:

Design: To avoid a "blank slate" experience, the app checks if storage is empty on load. If empty, it fetches 10 random users with nat=in (Indian nationality) from the RandomUser API.

Benefit: The evaluator immediately sees data populated with correct formatting (Indian states, real photos).

Modal vs. New Page:

Decision: Instead of navigating to a separate /add or /edit page, I implemented a Modal architecture.

Reasoning: This keeps the user context on the list view and provides a faster, more modern UX.

Strict Mode Handling:

Technical: Implemented useRef flags in useEffect hooks to prevent double API calls caused by React 18 Strict Mode in development.

Print Optimization:

Design: Added @media print styles in index.css to hide the sidebar, buttons, and search bars when the user prints the employee list.