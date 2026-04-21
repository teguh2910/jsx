import { useState } from "react";
import { C, S, I, Modal, genId } from "../shared";
export function Users({users,setUsers,depts,show}) {
  const [modal,setModal]=useState(false);
  const [ed,setEd]=useState({username:"",password:"",name:"",email:"",role:"admin_department",department:""});
  const [eid,setEid]=useState(null);
  const save=()=>{if(!ed.username||!ed.password||!ed.name||!ed.email){show("Fill required fields","error");return;}if(ed.role==="admin_department"&&!ed.department){show("Select department","error");return;}if(eid){setUsers(p=>p.map(u=>u.id===eid?{...u,...ed}:u));show("Updated");}else{setUsers(p=>[...p,{id:genId("USR"),...ed}]);show("Created");}setModal(false);setEd({username:"",password:"",name:"",email:"",role:"admin_department",department:""});setEid(null);};
  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,color:C.primary,fontSize:24}}>User Management</h2>
        <button onClick={()=>{setEd({username:"",password:"",name:"",email:"",role:"admin_department",department:""});setEid(null);setModal(true);}} style={S.btn("primary")}><I n="plus" s={18} c={C.white}/> Add User</button>
      </div>
      <div style={S.card}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
          <thead><tr style={{borderBottom:`2px solid ${C.grayLight}`}}>{["Name","Username","Email","Role","Dept","Actions"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 12px",color:C.gray,fontWeight:600,fontSize:12,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{users.map(u=>(
            <tr key={u.id} style={{borderBottom:`1px solid ${C.grayLight}`}}>
              <td style={{padding:"12px"}}><strong>{u.name}</strong></td>
              <td style={{padding:"12px",fontFamily:"monospace",fontSize:13}}>{u.username}</td>
              <td style={{padding:"12px"}}>{u.email}</td>
              <td style={{padding:"12px"}}><span style={S.badge(u.role==="superadmin"?C.primary:C.accent,u.role==="superadmin"?C.light:"#DBEAFE")}>{u.role==="superadmin"?"Super Admin":"Dept Admin"}</span></td>
              <td style={{padding:"12px"}}>{depts.find(d=>d.id===u.department)?.name||"-"}</td>
              <td style={{padding:"12px"}}><div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setEd({username:u.username,password:u.password,name:u.name,email:u.email,role:u.role,department:u.department||""});setEid(u.id);setModal(true);}} style={S.btn("outline","sm")}><I n="edit" s={14}/></button>
                {u.role!=="superadmin" && <button onClick={()=>{setUsers(p=>p.filter(x=>x.id!==u.id));show("Deleted");}} style={S.btn("ghost","sm")}><I n="trash" s={14} c={C.danger}/></button>}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title={eid?"Edit User":"New User"} width={520}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div><label style={S.label}>Name *</label><input style={S.input} value={ed.name} onChange={e=>setEd(p=>({...p,name:e.target.value}))}/></div>
          <div><label style={S.label}>Email *</label><input style={S.input} type="email" value={ed.email} onChange={e=>setEd(p=>({...p,email:e.target.value}))}/></div>
          <div><label style={S.label}>Username *</label><input style={S.input} value={ed.username} onChange={e=>setEd(p=>({...p,username:e.target.value}))}/></div>
          <div><label style={S.label}>Password *</label><input style={S.input} type="password" value={ed.password} onChange={e=>setEd(p=>({...p,password:e.target.value}))}/></div>
          <div><label style={S.label}>Role</label><select style={S.input} value={ed.role} onChange={e=>setEd(p=>({...p,role:e.target.value}))}><option value="admin_department">Dept Admin</option><option value="superadmin">Super Admin</option></select></div>
          <div><label style={S.label}>Dept {ed.role==="admin_department"?"*":""}</label><select style={S.input} value={ed.department} onChange={e=>setEd(p=>({...p,department:e.target.value}))} disabled={ed.role==="superadmin"}><option value="">Select</option>{depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:24}}><button onClick={()=>setModal(false)} style={S.btn("outline")}>Cancel</button><button onClick={save} style={S.btn("primary")}>{eid?"Update":"Create"}</button></div>
      </Modal>
    </div>
  );
}



