import {Router} from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import {auth,roles} from '../middleware/auth.js';
import {validDate,validId,futureSlot} from '../utils/helpers.js';

const r=Router();
const populate=q=>q.populate('patient','name email phone').populate('doctor','name specialization');

// Fixed clinic hours: 09:00 AM to 05:00 PM, in 30-minute intervals.
const makeDailySlots=()=>{
  const slots=[];
  for(let minutes=9*60;minutes<17*60;minutes+=30){
    const h=String(Math.floor(minutes/60)).padStart(2,'0');
    const m=String(minutes%60).padStart(2,'0');
    slots.push(`${h}:${m}`);
  }
  return slots;
};

// Return only future slots not already reserved by a pending or confirmed appointment.
r.get('/available-slots',auth,roles('patient'),async(req,res,next)=>{
  try{
    const {doctor,date}=req.query;
    if(!validId(doctor)||!validDate(date))return res.status(400).json({message:'Valid doctor and date are required'});
    const exists=await User.exists({_id:doctor,role:'doctor',isActive:true});
    if(!exists)return res.status(404).json({message:'Doctor not found'});
    const booked=await Appointment.find({doctor,date,status:{$in:['pending','confirmed']}},{time:1,_id:0}).lean();
    const occupied=new Set(booked.map(a=>a.time));
    const slots=makeDailySlots().filter(time=>!occupied.has(time)&&futureSlot(date,time));
    res.json({slots});
  }catch(e){next(e)}
});

r.get('/',auth,async(req,res,next)=>{try{const filter=req.user.role==='patient'?{patient:req.user.id}:req.user.role==='doctor'?{doctor:req.user.id}:{};res.json(await populate(Appointment.find(filter).sort({date:-1,time:-1}).limit(200)))}catch(e){next(e)}});

r.post('/',auth,roles('patient'),async(req,res,next)=>{try{
  const {doctor,date,time,reason}=req.body;
  if(!validId(doctor)||!validDate(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time||'')||!makeDailySlots().includes(time)||!futureSlot(date,time)||typeof reason!=='string'||!reason.trim()||reason.length>500)return res.status(400).json({message:'Select a valid future 30-minute slot, doctor and reason'});
  const exists=await User.exists({_id:doctor,role:'doctor',isActive:true});
  if(!exists)return res.status(404).json({message:'Doctor not found'});
  const a=await Appointment.create({doctor,patient:req.user.id,date,time,reason:reason.trim()});
  res.status(201).json(await populate(Appointment.findById(a.id)));
}catch(e){if(e.code===11000)return res.status(409).json({message:'This slot has just been booked by another patient. Please select another available slot.'});next(e)}});

r.patch('/:id/status',auth,async(req,res,next)=>{try{if(!validId(req.params.id))return res.status(400).json({message:'Invalid ID'});const a=await Appointment.findById(req.params.id);if(!a)return res.status(404).json({message:'Appointment not found'});const s=req.body.status;const isPatient=req.user.role==='patient'&&String(a.patient)===req.user.id;const isDoctor=req.user.role==='doctor'&&String(a.doctor)===req.user.id;const permitted=(isPatient&&s==='cancelled'&&['pending','confirmed'].includes(a.status))||(isDoctor&&((a.status==='pending'&&['confirmed','rejected'].includes(s))||(a.status==='confirmed'&&s==='completed')))||(req.user.role==='admin'&&s==='cancelled'&&['pending','confirmed'].includes(a.status));if(!permitted)return res.status(403).json({message:'Transition not permitted'});a.status=s;await a.save();res.json(await populate(Appointment.findById(a.id)))}catch(e){if(e.code===11000)return res.status(409).json({message:'Active slot conflict'});next(e)}});

r.patch('/:id/consultation',auth,roles('doctor'),async(req,res,next)=>{try{if(!validId(req.params.id))return res.status(400).json({message:'Invalid ID'});const notes=req.body.notes;if(typeof notes!=='string'||notes.length>3000)return res.status(400).json({message:'Notes must be under 3000 characters'});const a=await Appointment.findOne({_id:req.params.id,doctor:req.user.id,status:'completed'});if(!a)return res.status(404).json({message:'Completed consultation not found'});a.consultation={notes,updatedAt:new Date()};await a.save();res.json(await populate(Appointment.findById(a.id)))}catch(e){next(e)}});

export default r;
