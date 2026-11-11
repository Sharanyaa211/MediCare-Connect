import mongoose from 'mongoose';
const schema=new mongoose.Schema({patient:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},doctor:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},date:{type:String,required:true,match:/^\d{4}-\d{2}-\d{2}$/},time:{type:String,required:true,match:/^([01]\d|2[0-3]):[0-5]\d$/},reason:{type:String,required:true,maxlength:500},status:{type:String,enum:['pending','confirmed','completed','cancelled','rejected'],default:'pending'},consultation:{notes:{type:String,default:''},updatedAt:Date}},{timestamps:true});
schema.index({doctor:1,date:1,time:1},{unique:true,partialFilterExpression:{status:{$in:['pending','confirmed']}}});
export default mongoose.model('Appointment',schema);
