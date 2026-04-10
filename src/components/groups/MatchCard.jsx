import { memo } from "react";
import { ScoreInput } from "../ui/Primitives";
import { T } from "../ui/tokens";

export const MatchCard=memo(function MatchCard({match,onScoreChange}) {
  const fin=match.homeGoals!==null&&match.awayGoals!==null;
  const hw=fin&&match.homeGoals>match.awayGoals, aw=fin&&match.awayGoals>match.homeGoals;
  return (
    <div style={{background:fin?"rgba(245,197,24,0.04)":T.color.surface,border:`1px solid ${fin?"rgba(245,197,24,0.15)":T.color.border}`,borderRadius:T.radius.md,padding:`${T.space.sm}px ${T.space.md}px`,display:"flex",alignItems:"center",gap:T.space.sm,transition:"all .2s"}}>
      <span style={{display:"flex",alignItems:"center",gap:6,flex:1,justifyContent:"flex-end"}}>
        <span style={{fontSize:13,color:hw?T.color.text:T.color.textDim,fontWeight:hw?700:400,textAlign:"right"}}>{match.home.name}</span>
        <span style={{fontSize:16}}>{match.home.flag}</span>
      </span>
      <div style={{display:"flex",alignItems:"center",gap:T.space.xs}}>
        <ScoreInput value={match.homeGoals} onChange={v=>onScoreChange(match.id,"homeGoals",v)}/>
        <span style={{color:T.color.textMuted,fontWeight:900,fontSize:13,userSelect:"none"}}>×</span>
        <ScoreInput value={match.awayGoals} onChange={v=>onScoreChange(match.id,"awayGoals",v)}/>
      </div>
      <span style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
        <span style={{fontSize:16}}>{match.away.flag}</span>
        <span style={{fontSize:13,color:aw?T.color.text:T.color.textDim,fontWeight:aw?700:400}}>{match.away.name}</span>
      </span>
    </div>
  );
});
