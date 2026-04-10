import { T } from "../ui/tokens";

export function StandingsTable({standings,groupKey,best8}) {
  const best8Groups = best8?.map(x=>x.groupKey)??[];
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>{["#","Seleção","P","J","V","E","D","SG"].map(h=><th key={h} style={{padding:"5px 4px",textAlign:h==="Seleção"?"left":"center",color:T.color.textMuted,fontFamily:T.font.display,fontWeight:600,fontSize:10,letterSpacing:1,borderBottom:`1px solid ${T.color.border}`}}>{h}</th>)}</tr></thead>
        <tbody>
          {standings.map((s,i)=>{
            const q1=i<2, q3=i===2&&best8Groups.includes(groupKey);
            return (
              <tr key={s.team.id} style={{background:q1?(i===0?"rgba(245,197,24,0.07)":"rgba(245,197,24,0.03)"):q3?T.color.thirdDim:"transparent",borderBottom:`1px solid ${T.color.border}`}}>
                <td style={{padding:"7px 4px",textAlign:"center"}}><span style={{fontWeight:700,color:q1?T.color.gold:q3?T.color.third:T.color.textMuted,fontSize:10}}>{i+1}º</span></td>
                <td style={{padding:"7px 4px"}}><span style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:14}}>{s.team.flag}</span><span style={{color:T.color.text,fontSize:12}}>{s.team.name}</span></span></td>
                <td style={{padding:"7px 4px",textAlign:"center",fontWeight:700,color:T.color.gold}}>{s.points}</td>
                <td style={{padding:"7px 4px",textAlign:"center",color:T.color.textDim}}>{s.played}</td>
                <td style={{padding:"7px 4px",textAlign:"center",color:T.color.win}}>{s.won}</td>
                <td style={{padding:"7px 4px",textAlign:"center",color:T.color.textDim}}>{s.drawn}</td>
                <td style={{padding:"7px 4px",textAlign:"center",color:T.color.loss}}>{s.lost}</td>
                <td style={{padding:"7px 4px",textAlign:"center",fontWeight:600,color:s.goalDifference>0?T.color.win:s.goalDifference<0?T.color.loss:T.color.textMuted}}>{s.goalDifference>0?"+":""}{s.goalDifference}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{display:"flex",gap:T.space.md,marginTop:T.space.sm,flexWrap:"wrap"}}>
        <span style={{fontSize:10,color:T.color.textMuted}}>🟡 1º e 2º — Rodada de 32</span>
        <span style={{fontSize:10,color:T.color.third}}>🟣 3º entre melhores — Rodada de 32</span>
      </div>
    </div>
  );
}

