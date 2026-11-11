# MediCare Connect — MERN NoSQL project

A full-stack college demonstration application with patient, doctor and administrator roles. **Not for production clinical use**: do not enter real patient data. It does not implement consent workflows, audit trails, encryption at rest, backups, medical interoperability, or compliance controls.

## Requirements
- Node.js 20+ and npm
- MongoDB Community Server locally OR a MongoDB Atlas cluster

## Setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `backend/.env`: provide your MongoDB connection string, a random JWT_SECRET (32+ characters), and strong seed admin credentials. Never commit `.env`.

```bash
npm run seed
npm run dev
```

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173. Sign in using the admin credentials you seeded, add a doctor, then register a patient using the registration page. Log in as the patient to book an appointment, then log in as the doctor to confirm and complete it.

## REST endpoints

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register patient |
| POST | `/api/auth/login` | Public | Sign in |
| GET | `/api/auth/me` | Authenticated | Current profile |
| GET | `/api/doctors` | Authenticated | List doctors |
| POST | `/api/doctors` | Admin | Add doctor |
| PATCH | `/api/doctors/:id` | Admin | Update doctor |
| GET | `/api/appointments` | Authenticated | Role-scoped appointment list |
| POST | `/api/appointments` | Patient | Request slot |
| PATCH | `/api/appointments/:id/status` | Authorized owner | Change status |
| PATCH | `/api/appointments/:id/consultation` | Assigned doctor | Save notes after completion |
| GET | `/api/admin/stats` | Admin | Aggregate appointment statuses |
| GET | `/api/admin/patients` | Admin | List patient accounts |
| GET | `/api/health` | Public | Health probe |

## MongoDB collections
- `users`: patient, doctor and admin profiles (hashed passwords; never returned by API)
- `appointments`: patient/doctor ObjectId references, date, time, status, reason, embedded consultation notes

The report presents the logical roles of `users`, `doctors`, `appointments`, and `consultation records`; physically this implementation uses **two** collections. Doctors are user documents with `role: 'doctor'`; consultation records are embedded in appointments. This is intentional MongoDB document modeling.

## Workflow and access rules
- Patients can book future slots and cancel their own pending/confirmed bookings.
- Doctors can confirm/reject pending bookings, complete confirmed bookings, and write notes for their own completed consultations.
- Admins can add/edit doctors, see all appointments and patients, and cancel active bookings.
- A partial unique index prevents overlapping active bookings for a doctor at the same date/time; cancellations and rejections free the slot.

## Verification checklist
1. Register a patient and verify the `users` collection in MongoDB Compass.
2. Create a doctor as admin; confirm patient cannot call `POST /api/doctors`.
3. Book a future appointment; inspect `appointments` collection.
4. Attempt to book the same doctor/date/time twice; expect HTTP 409.
5. Confirm and complete as doctor; save notes.
6. Check that a different doctor cannot edit another doctor's booking.
7. Inspect admin status totals from the aggregation endpoint.
8. Test logout, invalid credentials and invalid appointment dates.

## Limitations
- Appointments use the clinic's local date/time; configure all users in one clinic timezone for demonstration. Production needs explicit IANA timezone handling.
- No email/SMS, file upload, prescription generation, payments or real clinical records.
- JWT is stored in sessionStorage for this educational demo. A production design should use secure HttpOnly cookies, CSRF protections where applicable, and stronger session management.
- Admin seed script must be run explicitly. It does not overwrite existing accounts.
- UI reads are limited to 200 appointments, 100 doctors, and 100 patients; production needs pagination.
