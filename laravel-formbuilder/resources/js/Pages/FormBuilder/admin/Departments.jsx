import { useState } from "react";
import { C, S, I, Modal, genId } from "../shared";
export function Departments({depts,setDepts,show}) {
  const [modal,setModal]=useState(false);
  const [ed,setEd]=useState({name:"",code:""});
  const [eid,setEid]=useState(null);
  const save=()=>{if(!ed.name||!ed.code){show("Fill all fields","error");return;}if(eid){setDepts(p=>p.map(d=>d.id===eid?{...d,...ed}:d));show("Updated");}else{setDepts(p=>[...p,{id:genId("DEP"),...ed}]);show("Created");}setModal(false);setEd({name:"",code:""});setEid(null);};
  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,color:C.primary,fontSize:24}}>Departments</h2>
        <button onClick={()=>{setEd({name:"",code:""});setEid(null);setModal(true);}} style={S.btn("primary")}><I n="plus" s={18} c={C.white}/> Add Dept</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {depts.map(d=>(
          <div key={d.id} style={S.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
              <div>
                <div style={{width:44,height:44,borderRadius:10,background:C.light,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><I n="dept" s={22} c={C.primary}/></div>
                <h3 style={{margin:"0 0 4px",color:C.primary,fontSize:17}}>{d.name}</h3>
                <span style={S.badge(C.gray,C.light)}>{d.code}</span>
              </div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>{setEd({name:d.name,code:d.code});setEid(d.id);setModal(true);}} style={{...S.btn("ghost","sm"),padding:"6px"}}><I n="edit" s={14} c={C.primary}/></button>
                <button onClick={()=>{setDepts(p=>p.filter(x=>x.id!==d.id));show("Deleted");}} style={{...S.btn("ghost","sm"),padding:"6px"}}><I n="trash" s={14} c={C.danger}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title={eid?"Edit Dept":"New Dept"} width={440}>
        <div style={{marginBottom:16}}><label style={S.label}>Name</label><input style={S.input} value={ed.name} onChange={e=>setEd(p=>({...p,name:e.target.value}))} placeholder="Marketing"/></div>
        <div style={{marginBottom:24}}><label style={S.label}>Code</label><input style={S.input} value={ed.code} onChange={e=>setEd(p=>({...p,code:e.target.value.toUpperCase()}))} placeholder="MKT" maxLength={5}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button onClick={()=>setModal(false)} style={S.btn("outline")}>Cancel</button><button onClick={save} style={S.btn("primary")}>{eid?"Update":"Create"}</button></div>
      </Modal>
    </div>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// USERS (Superadmin)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

