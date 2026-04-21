// Extracted from previous monolithic Dashboard.jsx
export const C = { primary: "#001A72", white: "#FFFFFF", light: "#F0F2F8", accent: "#0038E0", danger: "#DC2626", success: "#16A34A", warn: "#F59E0B", gray: "#64748B", grayLight: "#E2E8F0", grayDark: "#334155" };
export const genId = (p = "FRM") => `${p}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;

export const INIT_DEPTS = [
  { id:"dep-1", name:"Human Resources", code:"HR" },
  { id:"dep-2", name:"Finance", code:"FIN" },
  { id:"dep-3", name:"IT & Technology", code:"IT" },
  { id:"dep-4", name:"Operations", code:"OPS" },
];
export const INIT_USERS = [
  { id:"u-1", username:"superadmin", password:"admin123", role:"superadmin", name:"Super Administrator", email:"superadmin@company.com", department:null },
  { id:"u-2", username:"hr.admin", password:"hr123", role:"admin_department", name:"HR Administrator", email:"hr@company.com", department:"dep-1" },
  { id:"u-3", username:"fin.admin", password:"fin123", role:"admin_department", name:"Finance Administrator", email:"finance@company.com", department:"dep-2" },
];
export const STATUSES = {
  pending:{ label:"Pending", color:C.warn, bg:"#FEF3C7" },
  approved:{ label:"Approved", color:C.success, bg:"#DCFCE7" },
  rejected:{ label:"Rejected", color:C.danger, bg:"#FEE2E2" },
  in_review:{ label:"In Review", color:C.accent, bg:"#DBEAFE" },
};
export const FIELD_TYPES = [
  { value:"text", label:"Text Input", icon:"Aa" },
  { value:"textarea", label:"Text Area", icon:"Txt" },
  { value:"number", label:"Number", icon:"#" },
  { value:"email", label:"Email", icon:"@" },
  { value:"date", label:"Date", icon:"Dt" },
  { value:"dropdown", label:"Dropdown", icon:"v" },
  { value:"radio", label:"Radio", icon:"o" },
  { value:"checkbox", label:"Checkbox", icon:"[x]" },
  { value:"file", label:"File Upload", icon:"Fl" },
  { value:"calculation", label:"Calculation", icon:"Sum" },
  { value:"table", label:"Table", icon:"Tbl" },
];

// â”€â”€â”€ ICONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const I = ({n, s=20, c="currentColor"}) => {
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

// â”€â”€â”€ STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const S = {
  btn:(v="primary",sz="md")=>({ padding:sz==="sm"?"6px 14px":sz==="lg"?"14px 28px":"10px 20px", fontSize:sz==="sm"?13:sz==="lg"?16:14, fontWeight:600, borderRadius:8, border:v==="outline"?`2px solid ${C.primary}`:"none", background:v==="primary"?C.primary:v==="danger"?C.danger:v==="success"?C.success:v==="ghost"?"transparent":C.white, color:v==="outline"||v==="ghost"?C.primary:v==="primary"||v==="danger"||v==="success"?C.white:C.grayDark, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, transition:"all .2s", fontFamily:"inherit", letterSpacing:".01em" }),
  card:{ background:C.white, borderRadius:12, padding:24, boxShadow:"0 1px 3px rgba(0,26,114,.08), 0 4px 12px rgba(0,26,114,.04)" },
  input:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${C.grayLight}`, fontSize:14, fontFamily:"inherit", outline:"none", transition:"border-color .2s", boxSizing:"border-box" },
  label:{ display:"block", fontSize:13, fontWeight:600, color:C.grayDark, marginBottom:6, letterSpacing:".02em" },
  badge:(c,bg)=>({ display:"inline-flex", alignItems:"center", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, color:c, background:bg }),
};

// â”€â”€â”€ SHARED COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const Modal = ({open,onClose,title,children,width=560}) => {
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
export const Badge = ({status}) => { const s=STATUSES[status]||STATUSES.pending; return <span style={S.badge(s.color,s.bg)}>{s.label}</span>; };
export const Empty = ({icon,title,sub,action}) => (
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{width:64,height:64,borderRadius:16,background:C.light,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n={icon} s={28} c={C.primary}/></div>
    <h3 style={{margin:"0 0 8px",color:C.primary,fontSize:18}}>{title}</h3>
    <p style={{margin:"0 0 20px",color:C.gray,fontSize:14}}>{sub}</p>{action}
  </div>
);
export const Stat = ({icon,label,value,color=C.primary}) => (
  <div style={{...S.card,display:"flex",alignItems:"center",gap:16}}>
    <div style={{width:48,height:48,borderRadius:12,background:`${color}10`,display:"flex",alignItems:"center",justifyContent:"center"}}><I n={icon} s={24} c={color}/></div>
    <div><div style={{fontSize:26,fontWeight:700,color}}>{value}</div><div style={{fontSize:13,color:C.gray,marginTop:2}}>{label}</div></div>
  </div>
);

// â”€â”€â”€ SAFE EVAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const safeCalc = (expr) => { try { const s = String(expr).replace(/[^0-9+\-*/().,%\s]/g,""); return Function('"use strict"; return ('+s+')')(); } catch { return 0; } };

// â”€â”€â”€ TABLE FIELD COMPONENT (for form filling) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function TableFieldFill({field, value, onChange}) {
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
                {col.name} {col.type==="calc" && <span style={{opacity:.6}}>Î£</span>}
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
              <td style={{padding:"10px 8px",textAlign:"center",fontWeight:700,fontSize:11,color:C.primary}}>Î£</td>
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MAIN APP
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


