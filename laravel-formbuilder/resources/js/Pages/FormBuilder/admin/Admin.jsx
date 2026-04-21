import { C, I } from "../shared";
import { Dashboard } from "./Dashboard";
import { Forms } from "./Forms";
import { Submissions } from "./Submissions";
import { Departments } from "./Departments";
import { Users } from "./Users";
export function Admin({user,page,setPage,depts,setDepts,users,setUsers,templates,setTemplates,subs,setSubs,logout,show}) {
  const sa = user.role==="superadmin";
  const df = sa ? templates : templates.filter(f=>f.department===user.department);
  const ds = sa ? subs : subs.filter(s=>s.department===user.department);
  const nav = [
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"forms",label:"Form Builder",icon:"form"},
    {id:"submissions",label:"Submissions",icon:"report"},
    ...(sa?[{id:"departments",label:"Departments",icon:"dept"},{id:"user_management",label:"Users",icon:"users"}]:[]),
  ];
  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <aside style={{width:250,background:C.primary,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 20px 24px",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="form" s={18} c={C.white}/></div>
            <span style={{color:C.white,fontWeight:700,fontSize:17}}>FormFlow</span>
          </div>
          <div style={{padding:12,background:"rgba(255,255,255,.08)",borderRadius:8}}>
            <div style={{color:C.white,fontWeight:600,fontSize:14}}>{user.name}</div>
            <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:2}}>{sa?"Super Administrator":"Dept. Admin"}</div>
          </div>
        </div>
        <nav style={{flex:1,padding:"12px 10px"}}>
          {nav.map(it=>(
            <button key={it.id} onClick={()=>setPage(it.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 14px",borderRadius:8,border:"none",background:page===it.id?"rgba(255,255,255,.15)":"transparent",color:page===it.id?C.white:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:14,fontWeight:page===it.id?600:400,marginBottom:2,transition:"all .15s",fontFamily:"inherit"}}><I n={it.icon} s={18} c={page===it.id?C.white:"rgba(255,255,255,.5)"}/> {it.label}</button>
          ))}
        </nav>
        <div style={{padding:14}}><button onClick={logout} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",borderRadius:8,border:"none",background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}><I n="logout" s={18}/> Logout</button></div>
      </aside>
      <main style={{flex:1,padding:32,overflow:"auto"}}>
        {page==="dashboard" && <Dashboard df={df} ds={ds} sa={sa} depts={depts} setPage={setPage}/>}
        {page==="forms" && <Forms templates={df} setTemplates={setTemplates} depts={depts} user={user} show={show}/>}
        {page==="submissions" && <Submissions subs={ds} setSubs={setSubs} templates={df} show={show} depts={depts}/>}
        {page==="departments" && sa && <Departments depts={depts} setDepts={setDepts} show={show}/>}
        {page==="user_management" && sa && <Users users={users} setUsers={setUsers} depts={depts} show={show}/>}
      </main>
    </div>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DASHBOARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

