import { C, S, Badge, Stat } from "../shared";
export function Dashboard({df,ds,sa,depts,setPage}) {
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
                      <span style={{color:C.gray}}>{d.forms} forms Â· {d.subs} subs</span>
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
          <button onClick={()=>setPage("submissions")} style={{...S.btn("ghost","sm"),color:C.accent}}>View All â†’</button>
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FORM BUILDER â€” GROUPED BY DEPARTMENT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

