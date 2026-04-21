import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────
const C = { primary: "#001A72", white: "#FFFFFF", light: "#F0F2F8", accent: "#0038E0", danger: "#DC2626", success: "#16A34A", warn: "#F59E0B", gray: "#64748B", grayLight: "#E2E8F0", grayDark: "#334155" };
const genId = (p = "FRM") => `${p}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;

const INIT_DEPTS = [
  { id:"dep-1", name:"Human Resources", code:"HR" },
  { id:"dep-2", name:"Finance", code:"FIN" },
  { id:"dep-3", name:"IT & Technology", code:"IT" },
  { id:"dep-4", name:"Operations", code:"OPS" },
];
const INIT_USERS = [
  { id:"u-1", username:"superadmin", password:"admin123", role:"superadmin", name:"Super Administrator", email:"superadmin@company.com", department:null },
  { id:"u-2", username:"hr.admin", password:"hr123", role:"admin_department", name:"HR Administrator", email:"hr@company.com", department:"dep-1" },
  { id:"u-3", username:"fin.admin", password:"fin123", role:"admin_department", name:"Finance Administrator", email:"finance@company.com", department:"dep-2" },
];
const STATUSES = {
  pending:{ label:"Pending", color:C.warn, bg:"#FEF3C7" },
  approved:{ label:"Approved", color:C.success, bg:"#DCFCE7" },
  rejected:{ label:"Rejected", color:C.danger, bg:"#FEE2E2" },
  in_review:{ label:"In Review", color:C.accent, bg:"#DBEAFE" },
};
const FIELD_TYPES = [
  { value:"text", label:"Text Input", icon:"Aa" },
  { value:"textarea", label:"Text Area", icon:"¶" },
  { value:"number", label:"Number", icon:"#" },
  { value:"email", label:"Email", icon:"@" },
  { value:"date", label:"Date", icon:"📅" },
  { value:"dropdown", label:"Dropdown", icon:"▼" },
  { value:"radio", label:"Radio", icon:"◉" },
  { value:"checkbox", label:"Checkbox", icon:"☑" },
  { value:"file", label:"File Upload", icon:"📎" },
  { value:"calculation", label:"Calculation", icon:"Σ" },
  { value:"table", label:"Table", icon:"▦" },
];

// ─── ICONS ────────────────────────────────────────────────────────
const I = ({n, s=20, c="currentColor"}) => {
  const d = {
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    form:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></>,
    users:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    arrow:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    track:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    dept:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    mail:<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    trash:<><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></>,
    edit:<><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></>,
    eye:<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    report:<><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="m3 15 2 2 4-4"/></>,
    folder:<><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></>,
    table:<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></>,
    chevDown:<><polyline points="6 9 12 15 18 9"/></>,
    chevRight:<><polyline points="9 18 15 12 9 6"/></>,
    link:<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    lock:<><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    unlock:<><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>;
};

// ─── STYLES ───────────────────────────────────────────────────────
const S = {
  btn:(v="primary",sz="md")=>({ padding:sz==="sm"?"6px 14px":sz==="lg"?"14px 28px":"10px 20px", fontSize:sz==="sm"?13:sz==="lg"?16:14, fontWeight:600, borderRadius:8, border:v==="outline"?`2px solid ${C.primary}`:"none", background:v==="primary"?C.primary:v==="danger"?C.danger:v==="success"?C.success:v==="ghost"?"transparent":C.white, color:v==="outline"||v==="ghost"?C.primary:v==="primary"||v==="danger"||v==="success"?C.white:C.grayDark, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, transition:"all .2s", fontFamily:"inherit", letterSpacing:".01em" }),
  card:{ background:C.white, borderRadius:12, padding:24, boxShadow:"0 1px 3px rgba(0,26,114,.08), 0 4px 12px rgba(0,26,114,.04)" },
  input:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${C.grayLight}`, fontSize:14, fontFamily:"inherit", outline:"none", transition:"border-color .2s", boxSizing:"border-box" },
  label:{ display:"block", fontSize:13, fontWeight:600, color:C.grayDark, marginBottom:6, letterSpacing:".02em" },
  badge:(c,bg)=>({ display:"inline-flex", alignItems:"center", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, color:c, background:bg }),
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────
const Modal = ({open,onClose,title,children,width=560}) => {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,26,114,.25)",backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{...S.card,width,maxWidth:"94vw",maxHeight:"90vh",overflow:"auto",padding:0,animation:"modalIn .25s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:`1px solid ${C.grayLight}`}}>
          <h3 style={{margin:0,fontSize:18,color:C.primary}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><I n="x" s={20} c={C.gray}/></button>
        </div>
        <div style={{padding:24}}>{children}</div>
      </div>
    </div>
  );
};
const Badge = ({status}) => { const s=STATUSES[status]||STATUSES.pending; return <span style={S.badge(s.color,s.bg)}>{s.label}</span>; };
const Empty = ({icon,title,sub,action}) => (
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{width:64,height:64,borderRadius:16,background:C.light,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n={icon} s={28} c={C.primary}/></div>
    <h3 style={{margin:"0 0 8px",color:C.primary,fontSize:18}}>{title}</h3>
    <p style={{margin:"0 0 20px",color:C.gray,fontSize:14}}>{sub}</p>{action}
  </div>
);
const Stat = ({icon,label,value,color=C.primary}) => (
  <div style={{...S.card,display:"flex",alignItems:"center",gap:16}}>
    <div style={{width:48,height:48,borderRadius:12,background:`${color}10`,display:"flex",alignItems:"center",justifyContent:"center"}}><I n={icon} s={24} c={color}/></div>
    <div><div style={{fontSize:26,fontWeight:700,color}}>{value}</div><div style={{fontSize:13,color:C.gray,marginTop:2}}>{label}</div></div>
  </div>
);

// ─── SAFE EVAL ────────────────────────────────────────────────────
const safeCalc = (expr) => { try { const s = String(expr).replace(/[^0-9+\-*/().,%\s]/g,""); return Function('"use strict"; return ('+s+')')(); } catch { return 0; } };

// ─── TABLE FIELD COMPONENT (for form filling) ────────────────────
function TableFieldFill({field, value, onChange}) {
  const cols = field.tableColumns || [];
  const rows = value || [cols.reduce((a,c)=>({...a,[c.id]:""}),{})];

  const setCell = (ri, cid, val) => {
    const nr = rows.map((r,i) => i===ri ? {...r,[cid]:val} : r);
    onChange(nr);
  };
  const addRow = () => onChange([...rows, cols.reduce((a,c)=>({...a,[c.id]:""}),{})]);
  const delRow = (ri) => { if(rows.length<=1) return; onChange(rows.filter((_,i)=>i!==ri)); };

  const calcCell = (row, col) => {
    if(col.type !== "calc") return undefined;
    try {
      let expr = col.formula || "";
      cols.forEach(c => { expr = expr.replace(new RegExp(`\\{${c.name}\\}`,"g"), parseFloat(row[c.id])||0); });
      return safeCalc(expr);
    } catch { return 0; }
  };

  // Column & row summaries
  const colSums = cols.map(col => {
    if(col.type==="number" || col.type==="calc") {
      return rows.reduce((sum, row) => {
        const v = col.type==="calc" ? (calcCell(row,col)||0) : (parseFloat(row[col.id])||0);
        return sum + v;
      }, 0);
    }
    return null;
  });

  return (
    <div style={{overflowX:"auto",border:`1px solid ${C.grayLight}`,borderRadius:10}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:cols.length*140}}>
        <thead>
          <tr style={{background:C.primary}}>
            <th style={{padding:"10px 8px",color:C.white,fontSize:11,fontWeight:700,textAlign:"center",width:36}}>#</th>
            {cols.map(col => (
              <th key={col.id} style={{padding:"10px 12px",color:C.white,fontSize:11,fontWeight:700,textAlign:"left",textTransform:"uppercase",letterSpacing:".04em"}}>
                {col.name} {col.type==="calc" && <span style={{opacity:.6}}>Σ</span>}
              </th>
            ))}
            <th style={{width:40}}/>
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri) => (
            <tr key={ri} style={{borderBottom:`1px solid ${C.grayLight}`,background:ri%2===0?C.white:"#F8F9FC"}}>
              <td style={{padding:"8px",textAlign:"center",color:C.gray,fontSize:12,fontWeight:600}}>{ri+1}</td>
              {cols.map(col => {
                if(col.type==="calc") {
                  const val = calcCell(row,col);
                  return <td key={col.id} style={{padding:"6px 10px"}}><div style={{padding:"8px 12px",background:`${C.primary}06`,borderRadius:6,fontWeight:700,color:C.primary,textAlign:"right",fontFamily:"'JetBrains Mono',monospace"}}>{(val||0).toLocaleString('en',{minimumFractionDigits:0,maximumFractionDigits:2})}</div></td>;
                }
                if(col.type==="dropdown") {
                  return <td key={col.id} style={{padding:"6px 10px"}}><select style={{...S.input,padding:"8px 10px",fontSize:13}} value={row[col.id]||""} onChange={e=>setCell(ri,col.id,e.target.value)}><option value="">Select...</option>{(col.options||[]).map((o,i)=><option key={i} value={o}>{o}</option>)}</select></td>;
                }
                return (
                  <td key={col.id} style={{padding:"6px 10px"}}>
                    <input style={{...S.input,padding:"8px 10px",fontSize:13,textAlign:col.type==="number"?"right":"left"}} type={col.type==="number"?"number":"text"} value={row[col.id]||""} onChange={e=>setCell(ri,col.id,e.target.value)} placeholder={col.type==="number"?"0":"..."}/>
                  </td>
                );
              })}
              <td style={{padding:"6px 4px",textAlign:"center"}}>
                {rows.length>1 && <button onClick={()=>delRow(ri)} style={{background:"none",border:"none",cursor:"pointer",padding:4,opacity:.5}}><I n="x" s={14} c={C.danger}/></button>}
              </td>
            </tr>
          ))}
          {/* Totals row */}
          {colSums.some(v=>v!==null) && (
            <tr style={{background:`${C.primary}08`,borderTop:`2px solid ${C.primary}`}}>
              <td style={{padding:"10px 8px",textAlign:"center",fontWeight:700,fontSize:11,color:C.primary}}>Σ</td>
              {cols.map((col,ci) => (
                <td key={col.id} style={{padding:"10px 12px",fontWeight:700,color:C.primary,textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontSize:13}}>
                  {colSums[ci] !== null ? colSums[ci].toLocaleString('en',{minimumFractionDigits:0,maximumFractionDigits:2}) : ""}
                </td>
              ))}
              <td/>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{padding:"8px 12px",borderTop:`1px solid ${C.grayLight}`,background:"#FAFBFE"}}>
        <button onClick={addRow} style={{...S.btn("ghost","sm"),color:C.accent,fontSize:12,padding:"4px 10px"}}><I n="plus" s={14} c={C.accent}/> Add Row</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════════════
function Landing({onNav}) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <nav style={{background:C.primary,padding:"0 40px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="form" s={20} c={C.white}/></div>
          <span style={{color:C.white,fontSize:20,fontWeight:700,letterSpacing:"-.02em"}}>FormFlow</span>
        </div>
        <button onClick={()=>onNav("login")} style={{...S.btn("outline"),borderColor:"rgba(255,255,255,.3)",color:C.white}}>Admin Login</button>
      </nav>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40,background:`linear-gradient(135deg,${C.primary} 0%,#0038E0 100%)`}}>
        <div style={{textAlign:"center",maxWidth:700,animation:"fadeIn .6s ease"}}>
          <h1 style={{fontSize:48,fontWeight:800,color:C.white,margin:"0 0 16px",lineHeight:1.15,letterSpacing:"-.03em"}}>Digital Form<br/>Management System</h1>
          <p style={{fontSize:18,color:"rgba(255,255,255,.75)",margin:"0 0 40px",lineHeight:1.6}}>Submit forms, track approvals, manage workflows. No login required for submissions.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>onNav("fill_form")} style={{...S.btn("primary","lg"),background:C.white,color:C.primary}}><I n="form" s={20} c={C.primary}/> Submit a Form</button>
            <button onClick={()=>onNav("track")} style={{...S.btn("outline","lg"),borderColor:"rgba(255,255,255,.4)",color:C.white}}><I n="track" s={20} c={C.white}/> Track Submission</button>
          </div>
          <div style={{marginTop:48,display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
            {[["No Login Required","Submit forms instantly"],["Real-time Tracking","Monitor approval status"],["Auto Email Approval","Routed to supervisors"],["Table & Calc","Built-in spreadsheet math"]].map(([t,s],i)=>(
              <div key={i} style={{padding:"16px 24px",background:"rgba(255,255,255,.08)",borderRadius:12,backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.1)"}}>
                <div style={{color:C.white,fontWeight:700,fontSize:15}}>{t}</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:13,marginTop:4}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════
function Login({users,onLogin,onBack,show}) {
  const [u,setU]=useState(""); const [p,setP]=useState("");
  const go=()=>{ const f=users.find(x=>x.username===u&&x.password===p); if(f){show(`Welcome, ${f.name}!`);onLogin(f);} else show("Invalid credentials","error"); };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${C.primary},#0038E0)`}}>
      <div style={{...S.card,width:420,maxWidth:"94vw",animation:"fadeIn .4s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:56,height:56,borderRadius:14,background:`${C.primary}10`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n="form" s={28} c={C.primary}/></div>
          <h2 style={{margin:"0 0 4px",color:C.primary,fontSize:24}}>Admin Login</h2>
          <p style={{margin:0,color:C.gray,fontSize:14}}>Sign in to manage forms and submissions</p>
        </div>
        <div style={{marginBottom:18}}><label style={S.label}>Username</label><input style={S.input} value={u} onChange={e=>setU(e.target.value)} placeholder="Enter username" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        <div style={{marginBottom:24}}><label style={S.label}>Password</label><input style={S.input} type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        <button onClick={go} style={{...S.btn("primary","lg"),width:"100%",justifyContent:"center"}}>Sign In</button>
        <div style={{textAlign:"center",marginTop:16}}><button onClick={onBack} style={{...S.btn("ghost"),fontSize:13,color:C.gray}}>← Back to Home</button></div>
        <div style={{marginTop:24,padding:16,background:C.light,borderRadius:8,fontSize:12,color:C.gray}}>
          <strong>Demo:</strong> superadmin / admin123 · hr.admin / hr123 · fin.admin / fin123
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PUBLIC FORM FILL — GROUPED BY DEPARTMENT
// ═══════════════════════════════════════════════════════════════════
function PublicFill({templates,subs,setSubs,onBack,show,depts}) {
  const [sel,setSel]=useState(null);
  const [data,setData]=useState({});
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [dept,setDept]=useState("");
  const [subId,setSubId]=useState(null);
  const [expandedDept, setExpandedDept]=useState(null);
  // Prerequisite state
  const [prereqId,setPrereqId]=useState("");
  const [prereqVerified,setPrereqVerified]=useState(null); // null | {valid:true, sub} | {valid:false, reason}
  const [prereqLocked,setPrereqLocked]=useState(false); // once verified, lock it

  const published = templates.filter(f=>f.published);
  const grouped = depts.map(d=>({ ...d, forms: published.filter(f=>f.department===d.id) })).filter(g=>g.forms.length>0);

  const handleField = (fid,val) => setData(p=>({...p,[fid]:val}));

  const calcField = (field) => {
    if(!field.formula) return 0;
    try {
      let e = field.formula;
      (sel?.fields||[]).forEach(f=>{ e = e.replace(new RegExp(`\\{${f.label}\\}`,'g'), parseFloat(data[f.id])||0); });
      return safeCalc(e);
    } catch { return 0; }
  };

  // Verify prerequisite submission
  const verifyPrereq = () => {
    if(!prereqId.trim()){ show("Enter a Submission ID","error"); return; }
    const found = subs.find(s=>s.id.toLowerCase()===prereqId.trim().toLowerCase());
    if(!found){
      setPrereqVerified({valid:false, reason:"No submission found with this ID."});
      return;
    }
    // Check it matches the prerequisite template
    if(found.templateId !== sel.prerequisiteFormId){
      const prereqTpl = templates.find(t=>t.id===sel.prerequisiteFormId);
      setPrereqVerified({valid:false, reason:`This submission is for "${found.templateName}", but the required prerequisite is "${prereqTpl?.name||"unknown"}".`});
      return;
    }
    // Check approval status
    if(found.status !== "approved"){
      setPrereqVerified({valid:false, reason:`This submission is currently "${STATUSES[found.status]?.label||found.status}". It must be fully Approved before you can proceed.`});
      return;
    }
    setPrereqVerified({valid:true, sub:found});
    setPrereqLocked(true);
    show("Prerequisite verified! You can now fill the form.");
  };

  const submit = () => {
    if(!name||!email){show("Please fill name and email","error");return;}
    // Check prereq
    if(sel.prerequisiteFormId && (!prereqVerified || !prereqVerified.valid)){
      show("Please verify the prerequisite form first","error"); return;
    }
    const fid = genId("SUB");
    const steps = (sel.approvalFlow||[]).map((s,i)=>({...s,order:i,status:i===0?"in_review":"pending",reviewedAt:null,comments:""}));
    const calcs = {};
    sel.fields.filter(f=>f.type==="calculation").forEach(f=>{calcs[f.id]=calcField(f);});
    sel.fields.filter(f=>f.type==="table").forEach(f=>{
      const rows = data[f.id] || [];
      const cols = f.tableColumns || [];
      const computed = rows.map(row => {
        const nr = {...row};
        cols.filter(c=>c.type==="calc").forEach(c=>{
          let expr = c.formula||"";
          cols.forEach(cc=>{ expr = expr.replace(new RegExp(`\\{${cc.name}\\}`,"g"), parseFloat(row[cc.id])||0); });
          nr[c.id] = safeCalc(expr);
        });
        return nr;
      });
      calcs[f.id] = computed;
    });

    const ns = {
      id:fid, templateId:sel.id, templateName:sel.name, department:sel.department,
      employeeName:name, employeeEmail:email, employeeDept:dept,
      data:{...data,...calcs}, approvalSteps:steps, status:steps.length>0?"in_review":"approved",
      submittedAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
      prerequisiteSubId: prereqVerified?.sub?.id || null,
      prerequisiteFormName: prereqVerified?.sub?.templateName || null,
    };
    setSubs(p=>[...p,ns]); setSubId(fid); show("Form submitted successfully!");
  };

  // ── Success Screen
  if(subId) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${C.primary},#0038E0)`}}>
      <div style={{...S.card,width:500,textAlign:"center",animation:"fadeIn .4s ease"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><I n="check" s={36} c={C.success}/></div>
        <h2 style={{margin:"0 0 8px",color:C.primary}}>Form Submitted!</h2>
        <p style={{color:C.gray,margin:"0 0 24px"}}>Your submission has been received and routed for approval.</p>
        <div style={{padding:20,background:C.light,borderRadius:10,marginBottom:24}}>
          <div style={{fontSize:13,color:C.gray,marginBottom:4}}>Your Tracking ID</div>
          <div style={{fontSize:28,fontWeight:800,color:C.primary,letterSpacing:".03em",fontFamily:"'JetBrains Mono',monospace"}}>{subId}</div>
          <div style={{fontSize:12,color:C.gray,marginTop:8}}>Save this ID to track your submission status</div>
        </div>
        {prereqVerified?.sub && (
          <div style={{padding:14,background:"#EDE9FE",borderRadius:10,marginBottom:20,display:"flex",alignItems:"center",gap:10,border:"1px solid #DDD6FE"}}>
            <I n="link" s={18} c="#7C3AED"/>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontSize:11,color:"#7C3AED",fontWeight:600}}>Linked to Prerequisite</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:C.primary}}>{prereqVerified.sub.id}</div>
              <div style={{fontSize:11,color:C.gray}}>{prereqVerified.sub.templateName}</div>
            </div>
            <Badge status="approved"/>
          </div>
        )}
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={onBack} style={S.btn("primary")}>Back to Home</button>
          <button onClick={()=>{setSubId(null);setSel(null);setData({});setName("");setEmail("");setDept("");setPrereqId("");setPrereqVerified(null);setPrereqLocked(false);}} style={S.btn("outline")}>Submit Another</button>
        </div>
      </div>
    </div>
  );

  // ── Fill Form
  if(sel) return (
    <div style={{minHeight:"100vh",background:C.light}}>
      <nav style={{background:C.primary,padding:"0 40px",height:56,display:"flex",alignItems:"center",gap:16}}>
        <button onClick={()=>{setSel(null);setData({});setPrereqId("");setPrereqVerified(null);setPrereqLocked(false);}} style={{...S.btn("ghost"),color:C.white,padding:"6px 12px"}}>← Back</button>
        <span style={{color:C.white,fontWeight:600}}>{sel.name}</span>
      </nav>
      <div style={{maxWidth:760,margin:"32px auto",padding:"0 20px"}}>
        <div style={{...S.card,animation:"fadeIn .3s ease"}}>
          <h2 style={{margin:"0 0 4px",color:C.primary}}>{sel.name}</h2>
          <p style={{color:C.gray,margin:"0 0 24px",fontSize:14}}>{sel.description}</p>

          {/* ── PREREQUISITE VERIFICATION ── */}
          {sel.prerequisiteFormId && (()=>{
            const prereqTpl = templates.find(t=>t.id===sel.prerequisiteFormId);
            return (
              <div style={{padding:20,background:prereqLocked?"#DCFCE7":"#EDE9FE",borderRadius:10,marginBottom:24,border:`2px solid ${prereqLocked?C.success:"#7C3AED"}`,animation:"fadeIn .3s ease"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:36,height:36,borderRadius:8,background:prereqLocked?"#16A34A20":"#7C3AED20",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <I n={prereqLocked?"unlock":"lock"} s={18} c={prereqLocked?C.success:"#7C3AED"}/>
                  </div>
                  <div>
                    <div style={{fontWeight:700,color:prereqLocked?C.success:"#7C3AED",fontSize:15}}>
                      {prereqLocked?"✓ Prerequisite Verified":"Prerequisite Required"}
                    </div>
                    <div style={{fontSize:12,color:C.gray}}>
                      This form requires an approved submission of <strong>"{prereqTpl?.name||"Unknown Form"}"</strong>
                    </div>
                  </div>
                </div>

                {!prereqLocked ? (
                  <>
                    <div style={{display:"flex",gap:10,marginBottom:10}}>
                      <input 
                        style={{...S.input,flex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:14,letterSpacing:".03em"}} 
                        placeholder="Enter prerequisite Submission ID (e.g. SUB-LX1A...)" 
                        value={prereqId} 
                        onChange={e=>{setPrereqId(e.target.value);setPrereqVerified(null);}}
                        onKeyDown={e=>e.key==="Enter"&&verifyPrereq()}
                      />
                      <button onClick={verifyPrereq} style={{...S.btn("primary"),background:"#7C3AED",whiteSpace:"nowrap"}}>
                        <I n="search" s={16} c={C.white}/> Verify
                      </button>
                    </div>
                    {prereqVerified && !prereqVerified.valid && (
                      <div style={{padding:12,background:"#FEE2E2",borderRadius:8,fontSize:13,color:C.danger,display:"flex",alignItems:"center",gap:8}}>
                        <I n="x" s={16} c={C.danger}/> {prereqVerified.reason}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{padding:12,background:C.white,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:12,color:C.gray}}>Linked Submission</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:C.primary,fontSize:15}}>{prereqVerified.sub.id}</div>
                      <div style={{fontSize:12,color:C.gray,marginTop:2}}>
                        {prereqVerified.sub.templateName} · By {prereqVerified.sub.employeeName} · {new Date(prereqVerified.sub.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <Badge status="approved"/>
                      <button onClick={()=>{setPrereqLocked(false);setPrereqVerified(null);setPrereqId("");}} style={{...S.btn("ghost","sm"),padding:"4px 8px",color:C.gray,fontSize:11}}>Change</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Employee Info */}
          <div style={{padding:20,background:C.light,borderRadius:10,marginBottom:24}}>
            <h4 style={{margin:"0 0 16px",color:C.primary,fontSize:15}}>Employee Information</h4>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div><label style={S.label}>Full Name *</label><input style={S.input} value={name} onChange={e=>setName(e.target.value)}/></div>
              <div><label style={S.label}>Email *</label><input style={S.input} type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
              <div style={{gridColumn:"1/-1"}}><label style={S.label}>Department</label>
                <select style={S.input} value={dept} onChange={e=>setDept(e.target.value)}><option value="">Select Department</option>{depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
              </div>
            </div>
          </div>
          {/* Fields */}
          {sel.fields.map((field,idx) => (
            <div key={field.id} style={{marginBottom:20,animation:`fadeIn .3s ease ${idx*.04}s both`}}>
              <label style={S.label}>{field.label} {field.required && <span style={{color:C.danger}}>*</span>}</label>
              {field.type==="text" && <input style={S.input} value={data[field.id]||""} onChange={e=>handleField(field.id,e.target.value)}/>}
              {field.type==="textarea" && <textarea style={{...S.input,minHeight:100,resize:"vertical"}} value={data[field.id]||""} onChange={e=>handleField(field.id,e.target.value)}/>}
              {field.type==="number" && <input style={S.input} type="number" value={data[field.id]||""} onChange={e=>handleField(field.id,e.target.value)}/>}
              {field.type==="email" && <input style={S.input} type="email" value={data[field.id]||""} onChange={e=>handleField(field.id,e.target.value)}/>}
              {field.type==="date" && <input style={S.input} type="date" value={data[field.id]||""} onChange={e=>handleField(field.id,e.target.value)}/>}
              {field.type==="dropdown" && <select style={S.input} value={data[field.id]||""} onChange={e=>handleField(field.id,e.target.value)}><option value="">Select...</option>{(field.options||[]).map((o,i)=><option key={i} value={o}>{o}</option>)}</select>}
              {field.type==="radio" && <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:4}}>{(field.options||[]).map((o,i)=>(<label key={i} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:14,padding:"6px 14px",borderRadius:8,background:data[field.id]===o?`${C.primary}10`:C.light,border:data[field.id]===o?`2px solid ${C.primary}`:"2px solid transparent"}}><input type="radio" name={field.id} value={o} checked={data[field.id]===o} onChange={e=>handleField(field.id,e.target.value)} style={{display:"none"}}/>{o}</label>))}</div>}
              {field.type==="checkbox" && <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:4}}>{(field.options||[]).map((o,i)=>{const ck=(data[field.id]||[]).includes(o);return(<label key={i} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:14,padding:"6px 14px",borderRadius:8,background:ck?`${C.primary}10`:C.light,border:ck?`2px solid ${C.primary}`:"2px solid transparent"}}><input type="checkbox" checked={ck} onChange={()=>{const a=data[field.id]||[];handleField(field.id,ck?a.filter(x=>x!==o):[...a,o]);}} style={{display:"none"}}/>{ck?"☑":"☐"} {o}</label>);})}</div>}
              {field.type==="file" && <div style={{padding:20,border:`2px dashed ${C.grayLight}`,borderRadius:8,textAlign:"center",color:C.gray,fontSize:14}}><input type="file" onChange={e=>handleField(field.id,e.target.files[0]?.name||"")}/></div>}
              {field.type==="calculation" && (
                <div style={{padding:14,background:`${C.primary}08`,borderRadius:8,border:`1px solid ${C.primary}20`}}>
                  <div style={{fontSize:11,color:C.gray,marginBottom:4}}>Formula: {field.formula}</div>
                  <div style={{fontSize:22,fontWeight:700,color:C.primary,fontFamily:"'JetBrains Mono',monospace"}}>{calcField(field).toLocaleString()}</div>
                </div>
              )}
              {field.type==="table" && <TableFieldFill field={field} value={data[field.id]} onChange={v=>handleField(field.id,v)} />}
            </div>
          ))}
          {sel.approvalFlow?.length>0 && (
            <div style={{padding:16,background:"#FEF3C7",borderRadius:8,marginBottom:20,fontSize:13,color:"#92400E"}}>
              <strong>Approval Flow:</strong> This form will be routed through {sel.approvalFlow.length} step(s) — {sel.approvalFlow.map(a=>a.name).join(" → ")}
            </div>
          )}
          <button onClick={submit} style={{...S.btn("primary","lg"),width:"100%",justifyContent:"center"}}><I n="check" s={20} c={C.white}/> Submit Form</button>
        </div>
      </div>
    </div>
  );

  // ── Form List — GROUPED BY DEPARTMENT
  return (
    <div style={{minHeight:"100vh",background:C.light}}>
      <nav style={{background:C.primary,padding:"0 40px",height:56,display:"flex",alignItems:"center",gap:16}}>
        <button onClick={onBack} style={{...S.btn("ghost"),color:C.white,padding:"6px 12px"}}>← Back</button>
        <span style={{color:C.white,fontWeight:600}}>Available Forms</span>
      </nav>
      <div style={{maxWidth:820,margin:"32px auto",padding:"0 20px"}}>
        {grouped.length===0 ? <Empty icon="form" title="No Forms Available" sub="No published forms yet. Check back later."/> : (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {grouped.map(g => {
              const open = expandedDept === g.id || expandedDept === null;
              return (
                <div key={g.id} style={{animation:"fadeIn .3s ease"}}>
                  {/* Department Header */}
                  <button onClick={()=>setExpandedDept(expandedDept===g.id?null:g.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"16px 20px",background:C.primary,color:C.white,border:"none",borderRadius:open?"12px 12px 0 0":12,cursor:"pointer",fontFamily:"inherit",fontSize:16,fontWeight:700,transition:"all .2s"}}>
                    <div style={{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="folder" s={20} c={C.white}/></div>
                    <span style={{flex:1,textAlign:"left"}}>{g.name}</span>
                    <span style={{...S.badge("rgba(255,255,255,.85)","rgba(255,255,255,.15)"),fontSize:12}}>{g.forms.length} form{g.forms.length>1?"s":""}</span>
                    <I n={open?"chevDown":"chevRight"} s={20} c={C.white}/>
                  </button>
                  {/* Forms within department */}
                  {open && (
                    <div style={{background:C.white,borderRadius:"0 0 12px 12px",boxShadow:"0 2px 8px rgba(0,26,114,.06)"}}>
                      {g.forms.map((f,fi) => (
                        <div key={f.id} onClick={()=>setSel(f)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",cursor:"pointer",borderBottom:fi<g.forms.length-1?`1px solid ${C.grayLight}`:"none",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.light} onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                          <div>
                            <h4 style={{margin:"0 0 4px",color:C.primary,fontSize:15}}>{f.name}</h4>
                            <p style={{margin:0,color:C.gray,fontSize:13}}>{f.description||"No description"}</p>
                            <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>
                              <span style={S.badge(C.gray,C.light)}>{f.fields.length} fields</span>
                              {f.fields.some(x=>x.type==="table") && <span style={S.badge(C.accent,"#DBEAFE")}>Has Table</span>}
                              {f.fields.some(x=>x.type==="calculation") && <span style={S.badge(C.warn,"#FEF3C7")}>Has Calc</span>}
                              {f.prerequisiteFormId && (()=>{
                                const pf = templates.find(t=>t.id===f.prerequisiteFormId);
                                return <span style={S.badge("#7C3AED","#EDE9FE")}>🔗 Requires: {pf?.name||"Form A"}</span>;
                              })()}
                            </div>
                          </div>
                          <I n="arrow" s={20} c={C.primary}/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TRACKING
// ═══════════════════════════════════════════════════════════════════
function Track({subs,onBack}) {
  const [tid,setTid]=useState(""); const [res,setRes]=useState(null); const [searched,setSearched]=useState(false);
  const go=()=>{setSearched(true);setRes(subs.find(s=>s.id.toLowerCase()===tid.trim().toLowerCase())||null);};
  return (
    <div style={{minHeight:"100vh",background:C.light}}>
      <nav style={{background:C.primary,padding:"0 40px",height:56,display:"flex",alignItems:"center",gap:16}}>
        <button onClick={onBack} style={{...S.btn("ghost"),color:C.white,padding:"6px 12px"}}>← Back</button>
        <span style={{color:C.white,fontWeight:600}}>Track Submission</span>
      </nav>
      <div style={{maxWidth:640,margin:"40px auto",padding:"0 20px"}}>
        <div style={{...S.card,animation:"fadeIn .4s ease"}}>
          <h2 style={{margin:"0 0 8px",color:C.primary,textAlign:"center"}}>Track Your Form</h2>
          <p style={{color:C.gray,textAlign:"center",margin:"0 0 24px",fontSize:14}}>Enter your Form ID to check approval status</p>
          <div style={{display:"flex",gap:12}}>
            <input style={{...S.input,flex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:16,letterSpacing:".05em"}} placeholder="e.g. SUB-LX1A2B3C-D4EF" value={tid} onChange={e=>setTid(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
            <button onClick={go} style={S.btn("primary")}><I n="search" s={18} c={C.white}/> Track</button>
          </div>
        </div>
        {searched && !res && <div style={{...S.card,marginTop:20,textAlign:"center",animation:"fadeIn .3s ease"}}><I n="search" s={40} c={C.gray}/><p style={{color:C.gray,marginTop:12}}>No submission found with ID: <strong>{tid}</strong></p></div>}
        {res && (
          <div style={{...S.card,marginTop:20,animation:"fadeIn .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><h3 style={{margin:"0 0 4px",color:C.primary}}>{res.templateName}</h3><div style={{fontSize:13,color:C.gray}}>By {res.employeeName} · {new Date(res.submittedAt).toLocaleDateString()}</div></div>
              <Badge status={res.status}/>
            </div>

            {/* Linked prerequisite (this form depends on Form A) */}
            {res.prerequisiteSubId && (
              <div style={{padding:14,background:"#EDE9FE",borderRadius:8,marginBottom:16,display:"flex",alignItems:"center",gap:12,border:"1px solid #DDD6FE"}}>
                <I n="link" s={18} c="#7C3AED"/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#7C3AED",fontWeight:600,textTransform:"uppercase",letterSpacing:".04em"}}>Linked Prerequisite</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:C.primary}}>{res.prerequisiteSubId}</div>
                  <div style={{fontSize:12,color:C.gray}}>{res.prerequisiteFormName||"Form A"}</div>
                </div>
                <Badge status="approved"/>
              </div>
            )}

            {/* Dependent forms (other submissions that reference this one) */}
            {(()=>{
              const dependents = subs.filter(s=>s.prerequisiteSubId===res.id);
              if(dependents.length===0) return null;
              return (
                <div style={{padding:14,background:"#DBEAFE",borderRadius:8,marginBottom:16,border:"1px solid #BFDBFE"}}>
                  <div style={{fontSize:11,color:C.accent,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:8}}>Dependent Submissions (linked from this form)</div>
                  {dependents.map(d=>(
                    <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid #BFDBFE`}}>
                      <div>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.accent,fontWeight:600}}>{d.id}</span>
                        <span style={{fontSize:12,color:C.gray,marginLeft:8}}>{d.templateName}</span>
                      </div>
                      <Badge status={d.status}/>
                    </div>
                  ))}
                </div>
              );
            })()}
            <div style={{fontSize:14,fontWeight:600,color:C.primary,marginBottom:12}}>Approval Progress</div>
            {res.approvalSteps.map((step,i) => (
              <div key={i} style={{display:"flex",gap:16,marginBottom:i<res.approvalSteps.length-1?24:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:step.status==="approved"?C.success:step.status==="rejected"?C.danger:step.status==="in_review"?C.accent:C.grayLight,color:C.white,fontSize:14,fontWeight:700,flexShrink:0}}>{step.status==="approved"?"✓":step.status==="rejected"?"✕":i+1}</div>
                  {i<res.approvalSteps.length-1 && <div style={{width:2,flex:1,background:step.status==="approved"?C.success:C.grayLight,marginTop:4}}/>}
                </div>
                <div style={{flex:1,paddingBottom:4}}>
                  <div style={{fontWeight:600,fontSize:14}}>{step.name}</div>
                  <div style={{fontSize:12,color:C.gray}}>{step.email}</div>
                  <Badge status={step.status}/>
                  {step.comments && <div style={{marginTop:6,fontSize:13,fontStyle:"italic"}}>"{step.comments}"</div>}
                </div>
              </div>
            ))}
            {res.approvalSteps.length===0 && <div style={{fontSize:14,color:C.gray}}>No approval steps — auto-approved.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════
function Admin({user,page,setPage,depts,setDepts,users,setUsers,templates,setTemplates,subs,setSubs,logout,show}) {
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

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function Dashboard({df,ds,sa,depts,setPage}) {
  const pend=ds.filter(s=>s.status==="pending"||s.status==="in_review").length;
  const appr=ds.filter(s=>s.status==="approved").length;
  const rej=ds.filter(s=>s.status==="rejected").length;
  const recent=[...ds].sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt)).slice(0,8);
  const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=d.toISOString().split('T')[0];return{date:d.toLocaleDateString('en',{weekday:'short'}),count:ds.filter(s=>s.submittedAt.startsWith(k)).length};});
  const mx=Math.max(...last7.map(d=>d.count),1);

  // Forms per department
  const deptStats = depts.map(d => ({
    name: d.code,
    forms: df.filter(f=>f.department===d.id).length,
    subs: ds.filter(s=>s.department===d.id).length,
  }));

  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <h2 style={{margin:"0 0 24px",color:C.primary,fontSize:24,fontWeight:700}}>Dashboard</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:32}}>
        <Stat icon="form" label="Total Forms" value={df.length}/>
        <Stat icon="report" label="Submissions" value={ds.length} color={C.accent}/>
        <Stat icon="track" label="Pending" value={pend} color={C.warn}/>
        <Stat icon="check" label="Approved" value={appr} color={C.success}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        {/* 7-Day Bar */}
        <div style={S.card}>
          <h3 style={{margin:"0 0 20px",fontSize:16,color:C.primary}}>Submissions (Last 7 Days)</h3>
          <div style={{display:"flex",alignItems:"flex-end",gap:12,height:140}}>
            {last7.map((d,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <span style={{fontSize:11,color:C.gray,fontWeight:600}}>{d.count}</span>
                <div style={{width:"100%",height:`${(d.count/mx)*100}%`,minHeight:4,background:`linear-gradient(180deg,${C.primary},${C.accent})`,borderRadius:4,transition:"height .5s ease"}}/>
                <span style={{fontSize:11,color:C.gray}}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Dept Breakdown */}
        <div style={S.card}>
          <h3 style={{margin:"0 0 20px",fontSize:16,color:C.primary}}>By Department</h3>
          {deptStats.filter(d=>d.forms>0||d.subs>0).length===0 ?
            <p style={{color:C.gray,fontSize:14,textAlign:"center",padding:20}}>No data yet</p> :
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {deptStats.map((d,i)=>{
                const maxS = Math.max(...deptStats.map(x=>x.subs),1);
                return (
                  <div key={i}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                      <span style={{fontWeight:600,color:C.grayDark}}>{d.name}</span>
                      <span style={{color:C.gray}}>{d.forms} forms · {d.subs} subs</span>
                    </div>
                    <div style={{height:8,background:C.grayLight,borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(d.subs/maxS)*100}%`,background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:4,transition:"width .5s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>
      {/* Recent */}
      <div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{margin:0,fontSize:16,color:C.primary}}>Recent Submissions</h3>
          <button onClick={()=>setPage("submissions")} style={{...S.btn("ghost","sm"),color:C.accent}}>View All →</button>
        </div>
        {recent.length===0 ? <p style={{color:C.gray,fontSize:14,textAlign:"center",padding:20}}>No submissions yet</p> : (
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <thead><tr style={{borderBottom:`2px solid ${C.grayLight}`}}>{["ID","Form","Employee","Date","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:C.gray,fontWeight:600,fontSize:12,textTransform:"uppercase",letterSpacing:".05em"}}>{h}</th>)}</tr></thead>
            <tbody>{recent.map(s=>(
              <tr key={s.id} style={{borderBottom:`1px solid ${C.grayLight}`}}>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.accent}}>{s.id}</td>
                <td style={{padding:"10px 12px"}}>{s.templateName}</td>
                <td style={{padding:"10px 12px"}}>{s.employeeName}</td>
                <td style={{padding:"10px 12px",color:C.gray}}>{new Date(s.submittedAt).toLocaleDateString()}</td>
                <td style={{padding:"10px 12px"}}><Badge status={s.status}/></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FORM BUILDER — GROUPED BY DEPARTMENT
// ═══════════════════════════════════════════════════════════════════
function Forms({templates,setTemplates,depts,user,show}) {
  const [editing,setEditing]=useState(null);
  const [showBuilder,setShowBuilder]=useState(false);
  const sa = user.role==="superadmin";

  // Group forms by department
  const grouped = depts.map(d=>({...d, forms:templates.filter(f=>f.department===d.id)}));
  const [expandedDept, setExpandedDept] = useState(null);

  const newForm=()=>{
    setEditing({id:genId("TPL"),name:"",description:"",department:sa?"":user.department,fields:[],approvalFlow:[],published:false,createdAt:new Date().toISOString(),prerequisiteFormId:null});
    setShowBuilder(true);
  };
  const save=(form)=>{setTemplates(p=>{const i=p.findIndex(f=>f.id===form.id);if(i>=0){const c=[...p];c[i]=form;return c;}return[...p,form];});setShowBuilder(false);setEditing(null);show("Form saved!");};
  const del=(id)=>{
    // Also remove prerequisite links pointing to this form
    setTemplates(p=>p.filter(f=>f.id!==id).map(f=>f.prerequisiteFormId===id?{...f,prerequisiteFormId:null}:f));
    show("Form deleted");
  };
  const toggle=(id)=>{setTemplates(p=>p.map(f=>f.id===id?{...f,published:!f.published}:f));};

  if(showBuilder && editing) return <Editor form={editing} onSave={save} onCancel={()=>{setShowBuilder(false);setEditing(null);}} depts={depts} sa={sa} show={show} allTemplates={templates}/>;

  const hasAnyForms = templates.length > 0;

  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,color:C.primary,fontSize:24}}>Form Builder</h2>
        <button onClick={newForm} style={S.btn("primary")}><I n="plus" s={18} c={C.white}/> New Form</button>
      </div>

      {!hasAnyForms ? (
        <Empty icon="form" title="No Forms Yet" sub="Create your first form template to get started." action={<button onClick={newForm} style={S.btn("primary")}><I n="plus" s={18} c={C.white}/> Create Form</button>}/>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {grouped.filter(g=>g.forms.length>0).map(g => {
            const open = expandedDept === g.id || expandedDept === null;
            return (
              <div key={g.id}>
                {/* Department group header */}
                <button onClick={()=>setExpandedDept(expandedDept===g.id?null:g.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 20px",background:C.primary,color:C.white,border:"none",borderRadius:open?"12px 12px 0 0":12,cursor:"pointer",fontFamily:"inherit",fontSize:15,fontWeight:700,transition:"all .2s"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="folder" s={18} c={C.white}/></div>
                  <span style={{flex:1,textAlign:"left"}}>{g.name} ({g.code})</span>
                  <span style={{...S.badge("rgba(255,255,255,.85)","rgba(255,255,255,.18)"),fontSize:11}}>{g.forms.length} form{g.forms.length>1?"s":""}</span>
                  <I n={open?"chevDown":"chevRight"} s={18} c={C.white}/>
                </button>
                {open && (
                  <div style={{background:C.white,borderRadius:"0 0 12px 12px",boxShadow:"0 2px 8px rgba(0,26,114,.06)",overflow:"hidden"}}>
                    {g.forms.map((f,fi) => (
                      <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",borderBottom:fi<g.forms.length-1?`1px solid ${C.grayLight}`:"none"}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                            <h4 style={{margin:0,fontSize:15,color:C.primary}}>{f.name||"Untitled Form"}</h4>
                            {f.published ? <span style={S.badge(C.success,"#DCFCE7")}>Published</span> : <span style={S.badge(C.gray,C.grayLight)}>Draft</span>}
                          </div>
                          <p style={{margin:"2px 0 6px",fontSize:13,color:C.gray}}>{f.description||"No description"}</p>
                          <div style={{display:"flex",gap:6}}>
                            <span style={S.badge(C.gray,C.light)}>{f.fields.length} fields</span>
                            <span style={S.badge(C.gray,C.light)}>{f.approvalFlow.length} approvers</span>
                            {f.fields.some(x=>x.type==="table") && <span style={S.badge(C.accent,"#DBEAFE")}>Table</span>}
                            {f.fields.some(x=>x.type==="calculation") && <span style={S.badge(C.warn,"#FEF3C7")}>Calc</span>}
                            {f.prerequisiteFormId && (()=>{const pf=templates.find(t=>t.id===f.prerequisiteFormId);return <span style={S.badge("#7C3AED","#EDE9FE")} title={`Requires: ${pf?.name||"?"}`}>🔗 Requires: {pf?.name||"Unknown"}</span>;})()}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>toggle(f.id)} style={S.btn(f.published?"outline":"success","sm")}>{f.published?"Unpublish":"Publish"}</button>
                          <button onClick={()=>{setEditing({...JSON.parse(JSON.stringify(f))});setShowBuilder(true);}} style={S.btn("outline","sm")}><I n="edit" s={14}/> Edit</button>
                          <button onClick={()=>del(f.id)} style={S.btn("ghost","sm")}><I n="trash" s={14} c={C.danger}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {/* Ungrouped (shouldn't happen, but safety) */}
          {templates.filter(f=>!depts.some(d=>d.id===f.department)).length>0 && (
            <div style={S.card}>
              <h4 style={{margin:"0 0 12px",color:C.gray}}>Unassigned Department</h4>
              {templates.filter(f=>!depts.some(d=>d.id===f.department)).map(f=>(
                <div key={f.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.grayLight}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{f.name}</span>
                  <button onClick={()=>{setEditing({...JSON.parse(JSON.stringify(f))});setShowBuilder(true);}} style={S.btn("outline","sm")}>Edit</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FORM EDITOR (with TABLE field type) ──────────────────────────
function Editor({form,onSave,onCancel,depts,sa,show,allTemplates}) {
  const [f,setF]=useState(JSON.parse(JSON.stringify(form)));
  const [tab,setTab]=useState("fields");
  const up=(k,v)=>setF(p=>({...p,[k]:v}));
  const upField=(fid,k,v)=>setF(p=>({...p,fields:p.fields.map(x=>x.id===fid?{...x,[k]:v}:x)}));
  const rmField=(fid)=>setF(p=>({...p,fields:p.fields.filter(x=>x.id!==fid)}));
  const moveField=(i,d)=>{const ni=i+d;if(ni<0||ni>=f.fields.length)return;const a=[...f.fields];[a[i],a[ni]]=[a[ni],a[i]];setF(p=>({...p,fields:a}));};

  const addField=(type)=>{
    const nf = {
      id:genId("FLD"), type, label:"", required:false,
      options: ["dropdown","radio","checkbox"].includes(type)?["Option 1"]:undefined,
      formula: type==="calculation"?"":undefined,
      tableColumns: type==="table"?[
        {id:genId("COL"),name:"Item",type:"text"},
        {id:genId("COL"),name:"Qty",type:"number"},
        {id:genId("COL"),name:"Price",type:"number"},
        {id:genId("COL"),name:"Total",type:"calc",formula:"{Qty} * {Price}",options:[]},
      ]:undefined,
    };
    setF(p=>({...p,fields:[...p.fields,nf]}));
  };

  // Table column helpers
  const addCol=(fid)=>{
    setF(p=>({...p,fields:p.fields.map(x=>x.id===fid?{...x,tableColumns:[...(x.tableColumns||[]),{id:genId("COL"),name:"New Column",type:"text",formula:"",options:[]}]}:x)}));
  };
  const upCol=(fid,cid,k,v)=>{
    setF(p=>({...p,fields:p.fields.map(x=>x.id===fid?{...x,tableColumns:(x.tableColumns||[]).map(c=>c.id===cid?{...c,[k]:v}:c)}:x)}));
  };
  const rmCol=(fid,cid)=>{
    setF(p=>({...p,fields:p.fields.map(x=>x.id===fid?{...x,tableColumns:(x.tableColumns||[]).filter(c=>c.id!==cid)}:x)}));
  };

  const addApprover=()=>setF(p=>({...p,approvalFlow:[...p.approvalFlow,{id:genId("APR"),name:"",email:"",title:""}]}));
  const upApprover=(id,k,v)=>setF(p=>({...p,approvalFlow:p.approvalFlow.map(a=>a.id===id?{...a,[k]:v}:a)}));
  const rmApprover=(id)=>setF(p=>({...p,approvalFlow:p.approvalFlow.filter(a=>a.id!==id)}));

  const save=()=>{if(!f.name.trim()){show("Enter form name","error");return;}if(!f.department){show("Select department","error");return;}onSave(f);};

  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onCancel} style={S.btn("ghost")}>← Back</button>
          <h2 style={{margin:0,color:C.primary,fontSize:22}}>{form.name?"Edit Form":"New Form"}</h2>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={S.btn("outline")}>Cancel</button>
          <button onClick={save} style={S.btn("primary")}><I n="check" s={18} c={C.white}/> Save</button>
        </div>
      </div>
      {/* Info */}
      <div style={{...S.card,marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div><label style={S.label}>Form Name *</label><input style={S.input} value={f.name} onChange={e=>up("name",e.target.value)} placeholder="e.g. Leave Request"/></div>
          <div><label style={S.label}>Department *</label><select style={S.input} value={f.department} onChange={e=>up("department",e.target.value)} disabled={!sa}><option value="">Select</option>{depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description</label><textarea style={{...S.input,minHeight:60}} value={f.description} onChange={e=>up("description",e.target.value)} placeholder="Brief description..."/></div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:C.white,borderRadius:10,padding:4,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
        {[["fields","Form Fields"],["approval","Approval Flow"],["settings","Dependencies"],["preview","Preview"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"10px 16px",borderRadius:8,border:"none",background:tab===id?C.primary:"transparent",color:tab===id?C.white:C.gray,fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"inherit",transition:"all .2s"}}>{l}</button>
        ))}
      </div>

      {/* ── FIELDS TAB ── */}
      {tab==="fields" && (
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
          <div style={S.card}>
            <h4 style={{margin:"0 0 12px",fontSize:14,color:C.primary}}>Add Field</h4>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {FIELD_TYPES.map(ft=>(
                <button key={ft.value} onClick={()=>addField(ft.value)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:`1px solid ${C.grayLight}`,background:C.white,cursor:"pointer",fontSize:13,color:C.grayDark,fontFamily:"inherit",transition:"all .15s",textAlign:"left"}}>
                  <span style={{width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",background:ft.value==="calculation"?"#FEF3C7":ft.value==="table"?"#DBEAFE":C.light,borderRadius:6,fontSize:14}}>{ft.icon}</span>
                  {ft.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            {f.fields.length===0 ? <Empty icon="form" title="No Fields" sub="Click field types to add."/> : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {f.fields.map((field,idx) => (
                  <div key={field.id} style={{...S.card,border:`1px solid ${C.grayLight}`,animation:"fadeIn .25s ease"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{background:field.type==="calculation"?"#FEF3C7":field.type==="table"?"#DBEAFE":C.light,padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:600,color:C.primary}}>{FIELD_TYPES.find(t=>t.value===field.type)?.label}</span>
                        <span style={{fontSize:12,color:C.gray}}>#{idx+1}</span>
                      </div>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>moveField(idx,-1)} disabled={idx===0} style={{...S.btn("ghost","sm"),opacity:idx===0?.3:1,padding:"4px 8px"}}>↑</button>
                        <button onClick={()=>moveField(idx,1)} disabled={idx===f.fields.length-1} style={{...S.btn("ghost","sm"),opacity:idx===f.fields.length-1?.3:1,padding:"4px 8px"}}>↓</button>
                        <button onClick={()=>rmField(field.id)} style={{...S.btn("ghost","sm"),padding:"4px 8px"}}><I n="trash" s={14} c={C.danger}/></button>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end"}}>
                      <div><label style={S.label}>Field Label</label><input style={S.input} value={field.label} onChange={e=>upField(field.id,"label",e.target.value)} placeholder="Enter label..."/></div>
                      <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13,padding:"10px 0"}}><input type="checkbox" checked={field.required} onChange={e=>upField(field.id,"required",e.target.checked)}/> Required</label>
                    </div>

                    {/* Options for dropdown/radio/checkbox */}
                    {["dropdown","radio","checkbox"].includes(field.type) && (
                      <div style={{marginTop:12}}>
                        <label style={S.label}>Options</label>
                        {(field.options||[]).map((opt,oi)=>(
                          <div key={oi} style={{display:"flex",gap:8,marginBottom:6}}>
                            <input style={{...S.input,flex:1}} value={opt} onChange={e=>{const n=[...field.options];n[oi]=e.target.value;upField(field.id,"options",n);}}/>
                            <button onClick={()=>upField(field.id,"options",field.options.filter((_,i)=>i!==oi))} style={{...S.btn("ghost","sm"),color:C.danger,padding:"6px 10px"}}>✕</button>
                          </div>
                        ))}
                        <button onClick={()=>upField(field.id,"options",[...(field.options||[]),`Option ${(field.options?.length||0)+1}`])} style={{...S.btn("ghost","sm"),color:C.accent}}>+ Add Option</button>
                      </div>
                    )}

                    {/* Calculation formula */}
                    {field.type==="calculation" && (
                      <div style={{marginTop:12}}>
                        <label style={S.label}>Formula</label>
                        <input style={S.input} value={field.formula||""} onChange={e=>upField(field.id,"formula",e.target.value)} placeholder="e.g. {Quantity} * {Unit Price}"/>
                        <div style={{fontSize:11,color:C.gray,marginTop:4}}>Use {"{Field Label}"} to reference number fields. Supports: + - * / ( )</div>
                        {f.fields.filter(fl=>fl.type==="number").length>0 && <div style={{marginTop:4,fontSize:12,color:C.accent}}>Available: {f.fields.filter(fl=>fl.type==="number").map(fl=>`{${fl.label}}`).join(", ")}</div>}
                      </div>
                    )}

                    {/* ── TABLE COLUMN EDITOR ── */}
                    {field.type==="table" && (
                      <div style={{marginTop:16}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <label style={{...S.label,marginBottom:0}}>Table Columns</label>
                          <button onClick={()=>addCol(field.id)} style={{...S.btn("primary","sm"),fontSize:12}}><I n="plus" s={14} c={C.white}/> Add Column</button>
                        </div>
                        <div style={{border:`1px solid ${C.grayLight}`,borderRadius:10,overflow:"hidden"}}>
                          {/* Column header */}
                          <div style={{display:"grid",gridTemplateColumns:"1fr 120px 1fr 36px",gap:0,background:C.primary,padding:"8px 12px"}}>
                            <span style={{fontSize:11,fontWeight:700,color:C.white,textTransform:"uppercase"}}>Column Name</span>
                            <span style={{fontSize:11,fontWeight:700,color:C.white,textTransform:"uppercase"}}>Type</span>
                            <span style={{fontSize:11,fontWeight:700,color:C.white,textTransform:"uppercase"}}>Formula / Options</span>
                            <span/>
                          </div>
                          {(field.tableColumns||[]).map((col,ci) => (
                            <div key={col.id} style={{display:"grid",gridTemplateColumns:"1fr 120px 1fr 36px",gap:8,padding:"10px 12px",borderBottom:`1px solid ${C.grayLight}`,background:ci%2===0?C.white:"#F8F9FC",alignItems:"center"}}>
                              <input style={{...S.input,padding:"7px 10px",fontSize:13}} value={col.name} onChange={e=>upCol(field.id,col.id,"name",e.target.value)} placeholder="Column name"/>
                              <select style={{...S.input,padding:"7px 10px",fontSize:13}} value={col.type} onChange={e=>upCol(field.id,col.id,"type",e.target.value)}>
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="calc">Calculation</option>
                              </select>
                              <div>
                                {col.type==="calc" && (
                                  <input style={{...S.input,padding:"7px 10px",fontSize:12,fontFamily:"'JetBrains Mono',monospace"}} value={col.formula||""} onChange={e=>upCol(field.id,col.id,"formula",e.target.value)} placeholder="e.g. {Qty} * {Price}"/>
                                )}
                                {col.type==="dropdown" && (
                                  <input style={{...S.input,padding:"7px 10px",fontSize:12}} value={(col.options||[]).join(", ")} onChange={e=>upCol(field.id,col.id,"options",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))} placeholder="Opt1, Opt2, Opt3"/>
                                )}
                                {(col.type==="text"||col.type==="number") && <span style={{fontSize:12,color:C.gray,paddingLeft:8}}>—</span>}
                              </div>
                              <button onClick={()=>rmCol(field.id,col.id)} style={{background:"none",border:"none",cursor:"pointer",padding:4,opacity:.6}}><I n="x" s={14} c={C.danger}/></button>
                            </div>
                          ))}
                        </div>
                        <div style={{marginTop:8,padding:12,background:"#DBEAFE",borderRadius:8,fontSize:12,color:C.primary}}>
                          <strong>Table Tips:</strong> For calc columns use {"{Column Name}"} syntax. e.g. <code>{"{Qty} * {Price}"}</code>. Totals auto-sum for number & calc columns.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── APPROVAL TAB ── */}
      {tab==="approval" && (
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <h3 style={{margin:"0 0 4px",color:C.primary,fontSize:17}}>Approval Flow</h3>
              <p style={{margin:0,color:C.gray,fontSize:13}}>Add approvers in order. Each receives an email notification.</p>
            </div>
            <button onClick={addApprover} style={S.btn("primary","sm")}><I n="plus" s={16} c={C.white}/> Add Approver</button>
          </div>
          {f.approvalFlow.length===0 ? <Empty icon="users" title="No Approvers" sub="Forms will be auto-approved without approvers." action={<button onClick={addApprover} style={S.btn("primary")}><I n="plus" s={18} c={C.white}/> Add Approver</button>}/> : (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {f.approvalFlow.map((a,i)=>(
                <div key={a.id} style={{display:"flex",gap:16,alignItems:"center",padding:16,background:C.light,borderRadius:10}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:C.primary,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                    <div><label style={S.label}>Approver Name</label><input style={S.input} value={a.name} onChange={e=>upApprover(a.id,"name",e.target.value)} placeholder="John Smith"/></div>
                    <div><label style={S.label}>Email (auto-linked)</label><input style={S.input} type="email" value={a.email} onChange={e=>upApprover(a.id,"email",e.target.value)} placeholder="john@company.com"/></div>
                    <div><label style={S.label}>Title</label><input style={S.input} value={a.title} onChange={e=>upApprover(a.id,"title",e.target.value)} placeholder="Dept Head"/></div>
                  </div>
                  <button onClick={()=>rmApprover(a.id)} style={{...S.btn("ghost","sm"),padding:"8px"}}><I n="trash" s={16} c={C.danger}/></button>
                </div>
              ))}
              <div style={{padding:16,background:"#DBEAFE",borderRadius:8,fontSize:13,color:C.primary}}>
                <strong>📧 Email Notification:</strong> Each approver receives an automatic email in sequence.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── DEPENDENCIES / SETTINGS TAB ── */}
      {tab==="settings" && (
        <div style={S.card}>
          <div style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <I n="link" s={20} c={C.primary}/>
              <h3 style={{margin:0,color:C.primary,fontSize:17}}>Form Dependency (Prerequisite)</h3>
            </div>
            <p style={{margin:0,color:C.gray,fontSize:13}}>
              Set a prerequisite form that must be submitted and <strong>approved</strong> before this form can be filled out. 
              The employee will need to provide the approved Form A's Submission ID when filling Form B.
            </p>
          </div>

          <div style={{padding:20,background:C.light,borderRadius:10,marginBottom:20}}>
            <label style={S.label}>Prerequisite Form (Form A)</label>
            <select style={S.input} value={f.prerequisiteFormId||""} onChange={e=>up("prerequisiteFormId",e.target.value||null)}>
              <option value="">— No prerequisite (independent form) —</option>
              {(allTemplates||[]).filter(t=>t.id!==f.id).map(t=>{
                const d = depts.find(x=>x.id===t.department);
                return <option key={t.id} value={t.id}>[{d?.code||"?"}] {t.name}</option>;
              })}
            </select>
            {f.prerequisiteFormId && (()=>{
              const prereq = (allTemplates||[]).find(t=>t.id===f.prerequisiteFormId);
              if(!prereq) return null;
              const depName = depts.find(x=>x.id===prereq.department)?.name||"Unknown";
              return (
                <div style={{marginTop:16,padding:16,background:C.white,borderRadius:10,border:`2px solid #7C3AED`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{width:36,height:36,borderRadius:8,background:"#EDE9FE",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="link" s={18} c="#7C3AED"/></div>
                    <div>
                      <div style={{fontWeight:700,color:C.primary,fontSize:15}}>Linked to: {prereq.name}</div>
                      <div style={{fontSize:12,color:C.gray}}>Department: {depName} · {prereq.fields.length} fields</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#7C3AED",color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>1</div>
                      <span>Employee submits <strong>"{prereq.name}"</strong> and receives a Submission ID</span>
                    </div>
                    <div style={{width:2,height:12,background:"#DDD6FE",marginLeft:9}}/>
                    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#7C3AED",color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>2</div>
                      <span>Form A must be <strong style={{color:C.success}}>Approved</strong> by all approvers</span>
                    </div>
                    <div style={{width:2,height:12,background:"#DDD6FE",marginLeft:9}}/>
                    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#7C3AED",color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>3</div>
                      <span>Employee enters Form A's ID when filling <strong>"{f.name||"this form"}"</strong></span>
                    </div>
                    <div style={{width:2,height:12,background:"#DDD6FE",marginLeft:9}}/>
                    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#7C3AED",color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>4</div>
                      <span>System validates & links both submissions automatically</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {!f.prerequisiteFormId && (
            <div style={{padding:20,background:"#FEF3C7",borderRadius:10,fontSize:13,color:"#92400E"}}>
              <strong>ℹ No prerequisite set.</strong> This form can be submitted independently without any prior form approval.
            </div>
          )}
        </div>
      )}

      {/* ── PREVIEW TAB ── */}
      {tab==="preview" && (
        <div style={{...S.card,maxWidth:720}}>
          <h3 style={{margin:"0 0 4px",color:C.primary}}>{f.name||"Untitled"}</h3>
          <p style={{color:C.gray,margin:"0 0 20px",fontSize:14}}>{f.description||"No description"}</p>
          {f.fields.map(field=>(
            <div key={field.id} style={{marginBottom:16}}>
              <label style={S.label}>{field.label||"Untitled"} {field.required && <span style={{color:C.danger}}>*</span>}</label>
              {field.type==="text" && <input style={S.input} disabled placeholder="Text input"/>}
              {field.type==="textarea" && <textarea style={{...S.input,minHeight:80}} disabled placeholder="Text area"/>}
              {field.type==="number" && <input style={S.input} type="number" disabled placeholder="0"/>}
              {field.type==="email" && <input style={S.input} type="email" disabled placeholder="email@example.com"/>}
              {field.type==="date" && <input style={S.input} type="date" disabled/>}
              {field.type==="dropdown" && <select style={S.input} disabled><option>Select...</option>{(field.options||[]).map((o,i)=><option key={i}>{o}</option>)}</select>}
              {field.type==="radio" && <div style={{display:"flex",gap:12,marginTop:4}}>{(field.options||[]).map((o,i)=><label key={i} style={{fontSize:14}}><input type="radio" disabled/> {o}</label>)}</div>}
              {field.type==="checkbox" && <div style={{display:"flex",gap:12,marginTop:4}}>{(field.options||[]).map((o,i)=><label key={i} style={{fontSize:14}}><input type="checkbox" disabled/> {o}</label>)}</div>}
              {field.type==="file" && <div style={{padding:16,border:`2px dashed ${C.grayLight}`,borderRadius:8,textAlign:"center",color:C.gray,fontSize:13}}>File upload area</div>}
              {field.type==="calculation" && <div style={{padding:12,background:`${C.primary}08`,borderRadius:8,fontSize:13,color:C.primary}}>Σ Calculated: {field.formula||"No formula"}</div>}
              {field.type==="table" && (
                <div style={{border:`1px solid ${C.grayLight}`,borderRadius:10,overflow:"hidden"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead><tr style={{background:C.primary}}>{(field.tableColumns||[]).map(c=><th key={c.id} style={{padding:"10px 12px",color:C.white,fontSize:11,fontWeight:700,textAlign:"left",textTransform:"uppercase"}}>{c.name} {c.type==="calc"?"Σ":""}</th>)}</tr></thead>
                    <tbody><tr>{(field.tableColumns||[]).map(c=><td key={c.id} style={{padding:"10px 12px",color:C.gray,fontSize:12}}>{c.type==="calc"?`= ${c.formula}`:c.type==="number"?"0":"..."}</td>)}</tr></tbody>
                  </table>
                  <div style={{padding:8,background:"#FAFBFE",fontSize:12,color:C.gray,textAlign:"center"}}>+ Dynamic rows with auto-sum totals</div>
                </div>
              )}
            </div>
          ))}
          {f.fields.length===0 && <p style={{color:C.gray,textAlign:"center",padding:20}}>No fields added</p>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SUBMISSIONS
// ═══════════════════════════════════════════════════════════════════
function Submissions({subs,setSubs,templates,show,depts}) {
  const [filter,setFilter]=useState("all");
  const [q,setQ]=useState("");
  const [view,setView]=useState(null);
  const [comment,setComment]=useState("");

  const filtered = subs.filter(s=>{
    if(filter!=="all" && s.status!==filter) return false;
    if(q && !s.id.toLowerCase().includes(q.toLowerCase()) && !s.employeeName.toLowerCase().includes(q.toLowerCase()) && !s.templateName.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));

  const handleApproval=(sid,si,action)=>{
    setSubs(p=>p.map(s=>{
      if(s.id!==sid) return s;
      const st=[...s.approvalSteps]; st[si]={...st[si],status:action,reviewedAt:new Date().toISOString(),comments:comment};
      if(action==="approved" && si<st.length-1) st[si+1]={...st[si+1],status:"in_review"};
      const all=st.every(x=>x.status==="approved"); const rej=st.some(x=>x.status==="rejected");
      return {...s,approvalSteps:st,status:all?"approved":rej?"rejected":"in_review",updatedAt:new Date().toISOString()};
    }));
    setComment(""); show(action==="approved"?"Approved!":"Rejected");
  };

  const exportCSV=()=>{
    const h=["ID","Form","Employee","Email","Status","Submitted","Prerequisite ID"]; const r=filtered.map(s=>[s.id,s.templateName,s.employeeName,s.employeeEmail,s.status,new Date(s.submittedAt).toLocaleDateString(),s.prerequisiteSubId||"-"]);
    const csv=[h,...r].map(r=>r.join(",")).join("\n"); const b=new Blob([csv],{type:"text/csv"}); const u=URL.createObjectURL(b); const a=document.createElement("a");a.href=u;a.download="submissions_report.csv";a.click(); show("Report exported!");
  };

  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,color:C.primary,fontSize:24}}>Submissions</h2>
        <button onClick={exportCSV} style={S.btn("outline")}><I n="report" s={18}/> Export CSV</button>
      </div>
      <div style={{...S.card,marginBottom:20,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <input style={{...S.input,paddingLeft:36}} placeholder="Search ID, name, form..." value={q} onChange={e=>setQ(e.target.value)}/>
          <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}><I n="search" s={16} c={C.gray}/></div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {[["all","All"],["in_review","In Review"],["approved","Approved"],["rejected","Rejected"],["pending","Pending"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{padding:"7px 14px",borderRadius:8,border:"none",background:filter===v?C.primary:C.light,color:filter===v?C.white:C.gray,fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={S.card}>
        {filtered.length===0 ? <Empty icon="report" title="No Submissions" sub="No submissions match your filter."/> : (
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <thead><tr style={{borderBottom:`2px solid ${C.grayLight}`}}>{["ID","Form","Employee","Submitted","Status","Action"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 12px",color:C.gray,fontWeight:600,fontSize:12,textTransform:"uppercase",letterSpacing:".05em"}}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(s=>(
              <tr key={s.id} style={{borderBottom:`1px solid ${C.grayLight}`}}>
                <td style={{padding:"12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.accent}}>
                  {s.id}
                  {s.prerequisiteSubId && <div style={{fontSize:10,color:"#7C3AED",marginTop:2,display:"flex",alignItems:"center",gap:3}}><I n="link" s={10} c="#7C3AED"/> {s.prerequisiteSubId}</div>}
                </td>
                <td style={{padding:"12px"}}>{s.templateName}</td>
                <td style={{padding:"12px"}}><div>{s.employeeName}</div><div style={{fontSize:12,color:C.gray}}>{s.employeeEmail}</div></td>
                <td style={{padding:"12px",color:C.gray}}>{new Date(s.submittedAt).toLocaleDateString()}</td>
                <td style={{padding:"12px"}}><Badge status={s.status}/></td>
                <td style={{padding:"12px"}}><button onClick={()=>setView(s)} style={S.btn("outline","sm")}><I n="eye" s={14}/> View</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      <Modal open={!!view} onClose={()=>setView(null)} title="Submission Detail" width={720}>
        {view && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:C.accent}}>{view.id}</div><h3 style={{margin:"4px 0 0",color:C.primary}}>{view.templateName}</h3></div>
              <Badge status={view.status}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:16,background:C.light,borderRadius:8,marginBottom:20}}>
              <div><span style={{fontSize:12,color:C.gray}}>Employee</span><div style={{fontWeight:600}}>{view.employeeName}</div></div>
              <div><span style={{fontSize:12,color:C.gray}}>Email</span><div style={{fontWeight:600}}>{view.employeeEmail}</div></div>
              <div><span style={{fontSize:12,color:C.gray}}>Department</span><div style={{fontWeight:600}}>{depts.find(d=>d.id===view.employeeDept)?.name||"-"}</div></div>
              <div><span style={{fontSize:12,color:C.gray}}>Submitted</span><div style={{fontWeight:600}}>{new Date(view.submittedAt).toLocaleString()}</div></div>
            </div>
            {/* Linked prerequisite */}
            {view.prerequisiteSubId && (
              <div style={{padding:14,background:"#EDE9FE",borderRadius:8,marginBottom:20,display:"flex",alignItems:"center",gap:12,border:"1px solid #DDD6FE"}}>
                <I n="link" s={20} c="#7C3AED"/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:"#7C3AED",fontWeight:600}}>Linked Prerequisite</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:C.primary}}>{view.prerequisiteSubId}</div>
                  <div style={{fontSize:12,color:C.gray}}>{view.prerequisiteFormName||"Form A"}</div>
                </div>
                <Badge status="approved"/>
              </div>
            )}
            <h4 style={{margin:"0 0 12px",color:C.primary,fontSize:15}}>Form Data</h4>
            <div style={{marginBottom:20}}>
              {(()=>{
                const tpl=templates.find(t=>t.id===view.templateId);
                if(!tpl) return <p style={{color:C.gray}}>Template not found</p>;
                return tpl.fields.map(field => {
                  // Table data display
                  if(field.type==="table") {
                    const rows = view.data[field.id];
                    const cols = field.tableColumns||[];
                    if(!rows || !Array.isArray(rows)) return <div key={field.id} style={{marginBottom:12}}><span style={{color:C.gray}}>{field.label}: No data</span></div>;
                    return (
                      <div key={field.id} style={{marginBottom:16}}>
                        <div style={{fontWeight:600,color:C.primary,fontSize:14,marginBottom:6}}>{field.label}</div>
                        <div style={{border:`1px solid ${C.grayLight}`,borderRadius:8,overflow:"hidden"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                            <thead><tr style={{background:C.primary}}>{cols.map(c=><th key={c.id} style={{padding:"8px 12px",color:C.white,fontSize:11,fontWeight:700,textAlign:"left"}}>{c.name}</th>)}</tr></thead>
                            <tbody>
                              {rows.map((row,ri)=>(
                                <tr key={ri} style={{borderBottom:`1px solid ${C.grayLight}`}}>
                                  {cols.map(c=><td key={c.id} style={{padding:"8px 12px",textAlign:c.type==="number"||c.type==="calc"?"right":"left",fontWeight:c.type==="calc"?700:400,color:c.type==="calc"?C.primary:C.grayDark,fontFamily:c.type==="calc"||c.type==="number"?"'JetBrains Mono',monospace":"inherit"}}>{typeof row[c.id]==="number"?row[c.id].toLocaleString():(row[c.id]||"-")}</td>)}
                                </tr>
                              ))}
                              {/* Totals */}
                              <tr style={{background:`${C.primary}08`,borderTop:`2px solid ${C.primary}`}}>
                                {cols.map((c,ci)=>{
                                  if(c.type==="number"||c.type==="calc") {
                                    const sum=rows.reduce((s,r)=>s+(parseFloat(r[c.id])||0),0);
                                    return <td key={c.id} style={{padding:"8px 12px",fontWeight:700,color:C.primary,textAlign:"right",fontFamily:"'JetBrains Mono',monospace"}}>{sum.toLocaleString()}</td>;
                                  }
                                  return <td key={c.id} style={{padding:"8px 12px",fontWeight:700,color:C.primary,fontSize:11}}>{ci===0?"TOTAL":""}</td>;
                                })}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={field.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.grayLight}`}}>
                      <span style={{color:C.gray,fontSize:13}}>{field.label}</span>
                      <span style={{fontWeight:600,fontSize:13}}>{Array.isArray(view.data[field.id])?view.data[field.id].join(", "):view.data[field.id]||"-"}</span>
                    </div>
                  );
                });
              })()}
            </div>
            <h4 style={{margin:"0 0 12px",color:C.primary,fontSize:15}}>Approval Steps</h4>
            {view.approvalSteps.map((step,i)=>(
              <div key={i} style={{padding:16,background:C.light,borderRadius:8,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontWeight:600}}>Step {i+1}: {step.name}</div><div style={{fontSize:12,color:C.gray}}>{step.email} · {step.title}</div></div>
                  <Badge status={step.status}/>
                </div>
                {step.status==="in_review" && (
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.grayLight}`}}>
                    <textarea style={{...S.input,minHeight:60,marginBottom:10}} placeholder="Comments..." value={comment} onChange={e=>setComment(e.target.value)}/>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>handleApproval(view.id,i,"approved")} style={S.btn("success","sm")}><I n="check" s={14} c={C.white}/> Approve</button>
                      <button onClick={()=>handleApproval(view.id,i,"rejected")} style={S.btn("danger","sm")}><I n="x" s={14} c={C.white}/> Reject</button>
                    </div>
                  </div>
                )}
                {step.comments && <div style={{marginTop:8,fontSize:13,fontStyle:"italic"}}>Comment: "{step.comments}"</div>}
              </div>
            ))}
            {view.approvalSteps.length===0 && <p style={{color:C.gray,fontSize:14}}>No approval steps — auto-approved.</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DEPARTMENTS (Superadmin)
// ═══════════════════════════════════════════════════════════════════
function Departments({depts,setDepts,show}) {
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

// ═══════════════════════════════════════════════════════════════════
// USERS (Superadmin)
// ═══════════════════════════════════════════════════════════════════
function Users({users,setUsers,depts,show}) {
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
