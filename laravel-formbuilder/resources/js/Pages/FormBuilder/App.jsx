import { useState, useCallback } from "react";
import { C, I, INIT_DEPTS, INIT_USERS } from "./shared";
import { Landing, Login, PublicFill, Track } from "./PublicPages";
import { Admin } from "./AdminPages";
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("public_landing");
  const [depts, setDepts] = useState(INIT_DEPTS);
  const [users, setUsers] = useState(INIT_USERS);
  const [templates, setTemplates] = useState([]);
  const [subs, setSubs] = useState([]);
  const [toast, setToast] = useState(null);
  const show = useCallback((m,t="success")=>{ setToast({m,t}); setTimeout(()=>setToast(null),3500); },[]);
  const logout = ()=>{ setUser(null); setPage("public_landing"); };

  const render = () => {
    if(!user) {
      if(page==="login") return <Login users={users} onLogin={u=>{setUser(u);setPage("dashboard");}} onBack={()=>setPage("public_landing")} show={show}/>;
      if(page==="fill_form") return <PublicFill templates={templates} subs={subs} setSubs={setSubs} onBack={()=>setPage("public_landing")} show={show} depts={depts}/>;
      if(page==="track") return <Track subs={subs} onBack={()=>setPage("public_landing")}/>;
      return <Landing onNav={setPage}/>;
    }
    return <Admin user={user} page={page} setPage={setPage} depts={depts} setDepts={setDepts} users={users} setUsers={setUsers} templates={templates} setTemplates={setTemplates} subs={subs} setSubs={setSubs} logout={logout} show={show}/>;
  };

  return (
    <div style={{fontFamily:"'Segoe UI','Helvetica Neue',sans-serif",minHeight:"100vh",background:C.light,color:C.grayDark}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        input:focus,select:focus,textarea:focus{border-color:${C.primary}!important;box-shadow:0 0 0 3px rgba(0,26,114,.1)!important;}
        button:hover{opacity:.9} ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-thumb{background:${C.grayLight};border-radius:3px}
      `}</style>
      {render()}
      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,padding:"14px 24px",borderRadius:10,background:toast.t==="success"?C.success:toast.t==="error"?C.danger:C.primary,color:C.white,fontSize:14,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,.15)",animation:"slideDown .3s ease",display:"flex",alignItems:"center",gap:10}}>
          <I n={toast.t==="success"?"check":"x"} s={18} c={C.white}/>{toast.m}
        </div>
      )}
    </div>
  );
}

