import { useState, useEffect, useCallback, useRef } from "react";
import { C, S, I, Modal, Empty, FIELD_TYPES, genId } from "../shared";
export function Editor({form,onSave,onCancel,depts,sa,show,allTemplates}) {
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
          <button onClick={onCancel} style={S.btn("ghost")}>{"<-"} Back</button>
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

      {/* FIELDS TAB */}
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
                        <button onClick={()=>moveField(idx,-1)} disabled={idx===0} style={{...S.btn("ghost","sm"),opacity:idx===0?.3:1,padding:"4px 8px"}}>Up</button>
                        <button onClick={()=>moveField(idx,1)} disabled={idx===f.fields.length-1} style={{...S.btn("ghost","sm"),opacity:idx===f.fields.length-1?.3:1,padding:"4px 8px"}}>Down</button>
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
                            <button onClick={()=>upField(field.id,"options",field.options.filter((_,i)=>i!==oi))} style={{...S.btn("ghost","sm"),color:C.danger,padding:"6px 10px"}}>x</button>
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

                    {/* TABLE COLUMN EDITOR */}
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
                                {(col.type==="text"||col.type==="number") && <span style={{fontSize:12,color:C.gray,paddingLeft:8}}>-</span>}
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

      {/* APPROVAL TAB */}
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
                <strong>Email Notification:</strong> Each approver receives an automatic email in sequence.
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEPENDENCIES / SETTINGS TAB */}
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
                <option value="">- No prerequisite (independent form) -</option>
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
                    <div style={{fontSize:12,color:C.gray}}>Department: {depName} - {prereq.fields.length} fields</div>
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
              <strong>Info: No prerequisite set.</strong> This form can be submitted independently without any prior form approval.
            </div>
          )}
        </div>
      )}

      {/* PREVIEW TAB */}
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
                  {field.type==="calculation" && <div style={{padding:12,background:`${C.primary}08`,borderRadius:8,fontSize:13,color:C.primary}}>SUM Calculated: {field.formula||"No formula"}</div>}
              {field.type==="table" && (
                <div style={{border:`1px solid ${C.grayLight}`,borderRadius:10,overflow:"hidden"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                      <thead><tr style={{background:C.primary}}>{(field.tableColumns||[]).map(c=><th key={c.id} style={{padding:"10px 12px",color:C.white,fontSize:11,fontWeight:700,textAlign:"left",textTransform:"uppercase"}}>{c.name} {c.type==="calc"?"SUM":""}</th>)}</tr></thead>
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

// -------------------------------------------------------------------
// SUBMISSIONS
// -------------------------------------------------------------------

