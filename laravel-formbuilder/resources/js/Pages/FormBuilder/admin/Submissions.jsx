import { useState } from "react";
import { C, S, I, Modal, Badge, Empty, STATUSES, TableFieldFill } from "../shared";
export function Submissions({subs,setSubs,templates,show,depts}) {
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
                  <div><div style={{fontWeight:600}}>Step {i+1}: {step.name}</div><div style={{fontSize:12,color:C.gray}}>{step.email} Â· {step.title}</div></div>
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
            {view.approvalSteps.length===0 && <p style={{color:C.gray,fontSize:14}}>No approval steps â€” auto-approved.</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DEPARTMENTS (Superadmin)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

