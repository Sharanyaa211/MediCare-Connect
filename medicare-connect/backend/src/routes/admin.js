import { Router } from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { auth, roles } from '../middleware/auth.js';

const r = Router();
r.use(auth, roles('admin'));

// Admin dashboard analytics using MongoDB aggregation pipelines.
r.get('/stats', async (req, res, next) => {
  try {
    const [patients, doctors, totalAppointments, byStatus, byMonth] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor', isActive: true }),
      Appointment.countDocuments(),
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Appointment.aggregate([
        { $group: { _id: { $substrBytes: ['$date', 0, 7] }, count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        { $limit: 6 },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({ patients, doctors, totalAppointments, byStatus, byMonth });
  } catch (e) {
    next(e);
  }
});

r.get('/patients', async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(patients);
  } catch (e) {
    next(e);
  }
});

export default r;
