# Basic Task Manager

## Overview

The Basic Task Manager is a comprehensive web application that enables users to efficiently organize and manage their tasks. With features including user authentication, task creation, and management, this app provides an intuitive interface for handling tasks and maintaining productivity.

## Project Link

[Basic Task Manager](https://task-manager-qx3w.onrender.com/)

## Backend Link

[Backend API](https://basic-task-manager.onrender.com)

Please note that due to the free tier on Render, there may be a delay of up to 1 minute during startup.

## Project Structure

```
.
├── Backend
│ ├── index.js                # Main server file for the backend
│ ├── package-lock.json
│ └── package.json
│
├── frontend
│ ├── public
│ │ └── react.svg
│ ├── src
│ │ ├── assets
│ │ │ └── react.svg
│ │ └── components
│ │ ├── dashboard.tsx         # Dashboard component
│ │ ├── login.tsx             # Login component
│ │ ├── signup.tsx            # Sign-up component
│ │ └── taskform.tsx          # Task form component
│ ├── App.css
│ ├── App.tsx                 # Main application component
│ ├── index.css               # Global CSS styles
│ ├── main.tsx                # Entry point for the React application
│ ├── vite-env.d.ts
│ ├── .gitignore
│ ├── eslint.config.js
│ ├── index.html
│ ├── package-lock.json
│ ├── package.json
│ ├── postcss.config.js
│ ├── README.md
│ ├── tailwind.config.js      # Tailwind CSS configuration file
│ ├── tsconfig.app.json
│ ├── tsconfig.json
│ ├── tsconfig.node.json
│ └── vite.config.ts
│
├── .gitattributes
├── .gitignore
├── README.md
└── package.json
```

## Features

- **User Authentication**: Register, log in, and manage user accounts.
- **Task Management**: Create, update, and delete tasks.
- **Dashboard**: View and manage tasks with an intuitive user interface.

## Getting Started

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/basic-task-manager.git
   cd basic-task-manager
   ```

2. **Install backend dependencies:**

   ```bash
   cd Backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables:**

   - **Backend**: Create a `.env` file in the `Backend` directory with the following content:

     ```env
     FIREBASE_API_KEY=your-firebase-api-key
     FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
     FIREBASE_PROJECT_ID=your-firebase-project-id
     FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
     FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
     FIREBASE_APP_ID=your-firebase-app-id
     FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
     FIREBASE_TYPE=your-firebase-type
     FIREBASE_PRIVATE_KEY_ID=your-firebase-private-key-id
     FIREBASE_PRIVATE_KEY=your-firebase-private-key
     FIREBASE_CLIENT_EMAIL=your-firebase-client-email
     FIREBASE_CLIENT_ID=your-firebase-client-id
     FIREBASE_AUTH_URI=your-firebase-auth-uri
     FIREBASE_TOKEN_URI=your-firebase-token-uri
     FIREBASE_AUTH_PROVIDER_X509_CERT_URL=your-firebase-auth-provider-x509-cert-url
     FIREBASE_CLIENT_X509_CERT_URL=your-firebase-client-x509-cert-url
     FIREBASE_UNIVERSE_DOMAIN=your-firebase-universe-domain
     ```

   - **Frontend**: Create a `.env` file in the `frontend` directory with the following content:
     ```env
     VITE_FIREBASE_API_KEY=your-firebase-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-firebase-app-id
     VITE_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
     ```

5. **Run the backend server:**

   ```bash
   cd ../Backend
   npm start
   ```

6. **Configure Backend URL:**

   Update all API endpoint URLs in the frontend code to `localhost`.

7. **Run the frontend application:**

   ```bash
   cd ../frontend
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:[your Port Number]` to see the application in action.

## Usage

- **Sign Up**: Create a new account using the Sign-Up form.
- **Login**: Log in to access your tasks.
- **Dashboard**: Manage your tasks, including creating, updating, and deleting them.

## API Endpoints

### User Signup

- **Endpoint**: `POST /api/signup`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "uid": "user-uid"
  }
  ```

### User Login

- **Endpoint**: `POST /api/login`
- **Description**: Logs in a user.
- **Request Body**:
  ```json
  {
    "idToken": "firebase-id-token"
  }
  ```
- **Response**:
  ```json
  {
    "uid": "user-uid"
  }
  ```

### Create Task

- **Endpoint**: `POST /api/tasks`
- **Description**: Creates a new task.
- **Request Body**:
  ```json
  {
    "title": "Task Title",
    "dueDate": "2024-08-20",
    "description": "Task Description"
  }
  ```
- **Headers**:
  ```
  Authorization: Bearer [uid]
  ```
- **Response**:
  ```json
  {
    "id": "task-id",
    "title": "Task Title",
    "dueDate": "2024-08-20",
    "description": "Task Description",
    "status": "pending",
    "uid": "user-uid",
    "createdAt": "timestamp"
  }
  ```

### Get All Tasks

- **Endpoint**: `GET /api/tasks/:uid`
- **Description**: Retrieves all tasks for a user.
- **Response**:
  ```json
  [
    {
      "id": "task-id",
      "title": "Task Title",
      "dueDate": "2024-08-20",
      "description": "Task Description",
      "status": "pending",
      "uid": "user-uid",
      "createdAt": "timestamp"
    }
  ]
  ```

### Update Task

- **Endpoint**: `POST /api/tasks/:id`
- **Description**: Updates a task.
- **Request Body**:
  ```json
  {
    "title": "Updated Task Title",
    "dueDate": "2024-08-25",
    "description": "Updated Task Description"
  }
  ```
- **Headers**:
  ```
  Authorization: Bearer [uid]
  ```
- **Response**:
  ```json
  {
    "id": "task-id",
    "title": "Updated Task Title",
    "dueDate": "2024-08-25",
    "description": "Updated Task Description",
    "status": "pending",
    "uid": "user-uid",
    "createdAt": "timestamp"
  }
  ```

### Delete Task

- **Endpoint**: `DELETE /api/tasks/:id`
- **Description**: Deletes a task.
- **Headers**:
  ```
  Authorization: Bearer [uid]
  ```
- **Response**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

## Assumptions & Limitations

- **Limitations**:
  - Due to Render's free tier, there may be a delay of up to 1 minute at startup.
  - Compatibility issues may arise with older browsers due to JavaScript and CSS features.
  - For local development, Firebase configuration must be correctly added to the `.env` files for both backend and frontend.

## Acknowledgments

- [React](https://reactjs.org/) for the frontend framework.
- [Firebase](https://firebase.google.com/) for authentication and Firestore.
- [Vite](https://vitejs.dev/) for fast development builds.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS styling.
