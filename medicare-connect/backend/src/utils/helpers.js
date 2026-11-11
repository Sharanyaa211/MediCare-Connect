export const publicUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role,phone:u.phone,specialization:u.specialization,bio:u.bio});
export const validId=id=>/^[a-f\d]{24}$/i.test(id||'');
export const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d+'T00:00:00Z'));
export const futureSlot=(d,t)=>new Date(`${d}T${t}:00`).getTime()>Date.now();
