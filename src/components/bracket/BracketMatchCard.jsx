import { T } from "../ui/tokens";

export function BracketMatchCard({match,onPick,compact=false,label}) {
  return (
    <div style={{background:T.color.surface,border:`1px solid ${T.color.border}`,borderRadius:T.radius.md,overflow:"hidden"}}>
      {label && <div style={{padding:"3px 8px",background:"rgba(245,197,24,0.06)",borderBottom:`1px solid ${T.color.border}`}}><span style={{fontFamily:T.font.display,fontSize:9,color:T.color.gold,letterSpacing:1}}>{label}</span></div>}
      {[{team:match.home,slot:"home"},{team:match.away,slot:"away"}].map(({team,slot},idx)=>{
        const isW=match.winner?.id===team?.id, isL=match.winner&&team&&match.winner.id!==team.id;
        return (
          <div key={slot} onClick={()=>team&&onPick(team)}
            style={{padding:compact?"8px 10px":`${T.space.sm}px ${T.space.md}px`,display:"flex",alignItems:"center",gap:8,cursor:team?"pointer":"default",background:isW?T.color.goldDim:"transparent",borderBottom:idx===0?`1px solid ${T.color.border}`:"none",opacity:isL?0.28:1,transition:"background .15s,opacity .15s"}}
            onMouseEnter={e=>{if(team&&!isW)e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
            onMouseLeave={e=>{e.currentTarget.style.background=isW?T.color.goldDim:"transparent";}}
          >
            {!team ? (
              <><span style={{fontSize:14,opacity:0.25}}>—</span><span style={{fontSize:11,color:T.color.textMuted,fontStyle:"italic"}}>A definir</span></>
            ) : (
              <><span style={{fontSize:compact?15:18}}>{team.flag}</span>
              <span style={{fontSize:compact?11:12,fontWeight:isW?700:400,color:isW?T.color.gold:T.color.textDim,flex:1,fontFamily:isW?T.font.display:T.font.body,lineHeight:1.3}}>{team.name}</span>
              {isW&&<span style={{fontSize:9,color:T.color.gold}}>✓</span>}</>
            )}
          </div>
        );
      })}
    </div>
  );
}
