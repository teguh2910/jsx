import { useState } from "react";
import {
  C,
  S,
  I,
  Badge,
  Empty,
  Modal,
  STATUSES,
  genId,
  safeCalc,
  TableFieldFill,
} from "./shared";
export function Landing({onNav}) {
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// LOGIN
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export function Login({users,onLogin,onBack,show}) {
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
        <div style={{textAlign:"center",marginTop:16}}><button onClick={onBack} style={{...S.btn("ghost"),fontSize:13,color:C.gray}}>â† Back to Home</button></div>
        <div style={{marginTop:24,padding:16,background:C.light,borderRadius:8,fontSize:12,color:C.gray}}>
          <strong>Demo:</strong> superadmin / admin123 Â· hr.admin / hr123 Â· fin.admin / fin123
        </div>
      </div>
    </div>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PUBLIC FORM FILL â€” GROUPED BY DEPARTMENT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export function PublicFill({templates,subs,setSubs,onBack,show,depts}) {
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

  // â”€â”€ Success Screen
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

  // â”€â”€ Fill Form
  if(sel) return (
    <div style={{minHeight:"100vh",background:C.light}}>
      <nav style={{background:C.primary,padding:"0 40px",height:56,display:"flex",alignItems:"center",gap:16}}>
        <button onClick={()=>{setSel(null);setData({});setPrereqId("");setPrereqVerified(null);setPrereqLocked(false);}} style={{...S.btn("ghost"),color:C.white,padding:"6px 12px"}}>â† Back</button>
        <span style={{color:C.white,fontWeight:600}}>{sel.name}</span>
      </nav>
      <div style={{maxWidth:760,margin:"32px auto",padding:"0 20px"}}>
        <div style={{...S.card,animation:"fadeIn .3s ease"}}>
          <h2 style={{margin:"0 0 4px",color:C.primary}}>{sel.name}</h2>
          <p style={{color:C.gray,margin:"0 0 24px",fontSize:14}}>{sel.description}</p>

          {/* â”€â”€ PREREQUISITE VERIFICATION â”€â”€ */}
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
                      {prereqLocked?"âœ“ Prerequisite Verified":"Prerequisite Required"}
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
                        {prereqVerified.sub.templateName} Â· By {prereqVerified.sub.employeeName} Â· {new Date(prereqVerified.sub.submittedAt).toLocaleDateString()}
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
              {field.type==="checkbox" && <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:4}}>{(field.options||[]).map((o,i)=>{const ck=(data[field.id]||[]).includes(o);return(<label key={i} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:14,padding:"6px 14px",borderRadius:8,background:ck?`${C.primary}10`:C.light,border:ck?`2px solid ${C.primary}`:"2px solid transparent"}}><input type="checkbox" checked={ck} onChange={()=>{const a=data[field.id]||[];handleField(field.id,ck?a.filter(x=>x!==o):[...a,o]);}} style={{display:"none"}}/>{ck?"â˜‘":"â˜"} {o}</label>);})}</div>}
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
              <strong>Approval Flow:</strong> This form will be routed through {sel.approvalFlow.length} step(s) â€” {sel.approvalFlow.map(a=>a.name).join(" â†’ ")}
            </div>
          )}
          <button onClick={submit} style={{...S.btn("primary","lg"),width:"100%",justifyContent:"center"}}><I n="check" s={20} c={C.white}/> Submit Form</button>
        </div>
      </div>
    </div>
  );

  // â”€â”€ Form List â€” GROUPED BY DEPARTMENT
  return (
    <div style={{minHeight:"100vh",background:C.light}}>
      <nav style={{background:C.primary,padding:"0 40px",height:56,display:"flex",alignItems:"center",gap:16}}>
        <button onClick={onBack} style={{...S.btn("ghost"),color:C.white,padding:"6px 12px"}}>â† Back</button>
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
                                return <span style={S.badge("#7C3AED","#EDE9FE")}>ðŸ”— Requires: {pf?.name||"Form A"}</span>;
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// TRACKING
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export function Track({subs,onBack}) {
  const [tid,setTid]=useState(""); const [res,setRes]=useState(null); const [searched,setSearched]=useState(false);
  const go=()=>{setSearched(true);setRes(subs.find(s=>s.id.toLowerCase()===tid.trim().toLowerCase())||null);};
  return (
    <div style={{minHeight:"100vh",background:C.light}}>
      <nav style={{background:C.primary,padding:"0 40px",height:56,display:"flex",alignItems:"center",gap:16}}>
        <button onClick={onBack} style={{...S.btn("ghost"),color:C.white,padding:"6px 12px"}}>â† Back</button>
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
              <div><h3 style={{margin:"0 0 4px",color:C.primary}}>{res.templateName}</h3><div style={{fontSize:13,color:C.gray}}>By {res.employeeName} Â· {new Date(res.submittedAt).toLocaleDateString()}</div></div>
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
                  <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:step.status==="approved"?C.success:step.status==="rejected"?C.danger:step.status==="in_review"?C.accent:C.grayLight,color:C.white,fontSize:14,fontWeight:700,flexShrink:0}}>{step.status==="approved"?"âœ“":step.status==="rejected"?"âœ•":i+1}</div>
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
            {res.approvalSteps.length===0 && <div style={{fontSize:14,color:C.gray}}>No approval steps â€” auto-approved.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN PANEL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


