# MediCare Connect 🏥

MediCare Connect is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for streamlined healthcare appointment management. It provides role-based workspaces for **Patients**, **Doctors**, and **Administrators** to manage visits, patient records, and system analytics in real time.

---

## 🌟 Key Features & User Roles

### 👤 Patient Portal
* **Self-Registration & Login**: Patients can create their own accounts via the registration form.
* **Appointment Booking**: Real-time checking of available 30-minute slots per doctor and date.
* **Visit Management**: Track upcoming and past appointment statuses (`pending`, `confirmed`, `completed`, `cancelled`, `rejected`).
* **Consultation Notes**: View consultation notes and medical summaries recorded by doctors after completing a visit.

### 🩺 Doctor Portal
* **Admin-Managed Access**: Doctors log in using credentials created and provided to them by an Administrator (no public self-registration exists for doctor accounts).
* **Schedule & Requests**: View all appointment requests assigned specifically to the logged-in doctor.
* **Status Updates**: Review pending appointment requests to confirm, reject, or mark visits as completed.
* **Digital Consultation Notes**: Add and save medical notes directly to patient records upon visit completion.

### 🛡️ Admin Dashboard
* **Doctor Onboarding**: Create doctor accounts with assigned email addresses, passwords, phone numbers, specializations, and bios.
* **System Overview**: Track real-time stats including total appointments, pending visits, registered patients, and active doctor counts.
* **Patient Records**: View registered patient profiles and details.
* **Analytics & Performance**: Access status breakdowns, monthly visit trends, doctor metrics, and MongoDB query execution performance (`explain('executionStats')`).

---

## 🛠️ Prerequisites

Ensure you have the following installed before running the project locally:
* **Node.js**: `v20.x` or higher (`node -v`)
* **npm**: `v9.x` or higher (`npm -v`)
* **MongoDB**: A running local MongoDB service or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database cluster.

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd medicare-connect/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory (copy from `.env.example` if available):
   ```bash
   cp .env.example .env
   ```

4. Configure your `backend/.env` file with the following variables:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5174
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/medicare_connect?retryWrites=true&w=majority
   JWT_SECRET=your_32_plus_character_secure_random_string
   SEED_ADMIN_EMAIL=admin@example.com
   SEED_ADMIN_PASSWORD=Admin@12345678
   ```
   > **Note**: Replace `<username>`, `<password>`, and `<cluster-url>` with your database credentials. Make sure `CLIENT_URL` matches your frontend port (e.g. `http://localhost:5174` or `http://localhost:5173`).

5. Seed the initial Administrator account into the database:
   ```bash
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start at `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a **new** terminal window and navigate to the `frontend` folder:
   ```bash
   cd medicare-connect/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory:
   ```bash
   cp .env.example .env
   ```

4. Configure your `frontend/.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The Vite server will start and output your URL (e.g., `http://localhost:5174` or `http://localhost:5173`).*

---

## 🧪 End-to-End Walkthrough Guide

To test the complete workflow across all user roles:

1. **Log in as Admin**:
   * Open `http://localhost:5174` in your browser.
   * Log in with the seeded credentials (`admin@example.com` / `Admin@12345678`).

2. **Add a Doctor**:
   * Go to the **Doctors** section from the sidebar menu.
   * Scroll down to **Add a doctor** and create a doctor account (e.g., set email to `doctor@example.com` and password to `Doctor123!`).
   * *Note down the email and password you created for this doctor.*

3. **Register & Book as a Patient**:
   * Click **Sign out**, then click **Create account** on the login page.
   * Register a new patient account and sign in.
   * Under **Appointments**, choose a doctor, select a date and an available 30-minute time slot, provide a reason for the visit, and click **Request appointment**.

4. **Manage Visit as Doctor**:
   * Sign out and log in using the doctor credentials created in Step 2 (`doctor@example.com` / `Doctor123!`).
   * Navigate to **Appointments** to view the pending request.
   * Click **Confirm** to accept the appointment, then click **Complete** once finished and write consultation notes.

---

## 📁 Project Structure

```
medicare-connect/
├── backend/
│   ├── src/
│   │   ├── middleware/   # Auth & Role validation (JWT)
│   │   ├── models/       # Mongoose Schemas (User, Appointment)
│   │   ├── routes/       # API endpoints (auth, doctors, appointments, admin)
│   │   ├── utils/        # Helper functions
│   │   ├── seed.js       # Admin seeding script
│   │   └── server.js     # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx       # Single-file React application component & routing logic
    │   ├── main.jsx      # React DOM rendering
    │   └── style.css     # Global UI styles
    └── package.json
```

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Lucide React Icons, CSS3
* **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcrypt.js
* **Database**: MongoDB (Mongoose ODM)