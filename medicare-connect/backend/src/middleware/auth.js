import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function auth(req,res,next){try{const token=(req.headers.authorization||'').replace(/^Bearer /,'');if(!token)return res.status(401).json({message:'Authentication required'});const payload=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(payload.sub);if(!user||!user.isActive)return res.status(401).json({message:'Account unavailable'});req.user=user;next()}catch(e){return res.status(401).json({message:'Invalid or expired token'})}}
export const roles=(...allowed)=>(req,res,next)=>allowed.includes(req.user.role)?next():res.status(403).json({message:'Forbidden'});
