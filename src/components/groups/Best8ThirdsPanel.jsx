import { T } from "../ui/tokens";
import { SectionLabel } from "../ui/Primitives";

export function Best8ThirdsPanel({best8}) {
  return (
    <div style={{background:T.color.surface,border:`1px solid ${T.color.thirdBorder}`,borderRadius:T.radius.lg,padding:T.space.md,marginBottom:T.space.lg}}>
      <SectionLabel style={{color:T.color.third,marginBottom:T.space.sm}}>🟣 8 Melhores 3ºs — Vaga na Rodada de 32</SectionLabel>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:T.space.sm}}>
        {Array.from({length:8},(_,i)=>{
          const entry = best8[i];
          const s = entry?.standing;
          return (
            <div key={i} style={{background:entry?T.color.thirdDim:"rgba(255,255,255,0.02)",border:`1px solid ${entry?T.color.thirdBorder:T.color.border}`,borderRadius:T.radius.md,padding:`${T.space.xs}px ${T.space.sm}px`,display:"flex",alignItems:"center",gap:T.space.sm}}>
              <span style={{fontFamily:T.font.display,fontSize:11,fontWeight:700,color:T.color.third,minWidth:16}}>{i+1}</span>
              {entry ? (
                <span style={{display:"flex",alignItems:"center",gap:5,flex:1}}>
                  <span style={{fontSize:16}}>{s.team.flag}</span>
                  <span style={{flex:1}}>
                    <div style={{fontSize:12,color:T.color.text,fontWeight:600}}>{s.team.name}</div>
                    <div style={{fontSize:10,color:T.color.textMuted}}>Grp {entry.groupKey} · {s.points}pts · {s.goalDifference>0?"+":""}{s.goalDifference}</div>
                  </span>
                </span>
              ) : (
                <span style={{fontSize:11,color:T.color.textMuted,fontStyle:"italic"}}>Aguardando...</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
