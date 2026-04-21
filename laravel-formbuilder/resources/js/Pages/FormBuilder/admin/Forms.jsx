import { useState } from "react";
import { C, S, I, Empty, genId } from "../shared";
import { Editor } from "./Editor";
export function Forms({templates,setTemplates,depts,user,show}) {
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
                            {f.prerequisiteFormId && (()=>{const pf=templates.find(t=>t.id===f.prerequisiteFormId);return <span style={S.badge("#7C3AED","#EDE9FE")} title={`Requires: ${pf?.name||"?"}`}>ðŸ”— Requires: {pf?.name||"Unknown"}</span>;})()}
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

// â”€â”€â”€ FORM EDITOR (with TABLE field type) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

