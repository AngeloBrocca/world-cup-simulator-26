import { useR32 } from "../../hooks/useR32";
import { T } from "../ui/tokens";
import {BracketMatchCard} from "./BracketMatchCard";
import { R32_FIXTURE_BASES } from "../../domain/knockoutBracket";

function TeamPill({team,color}) {
  const c=color||T.color.gold;
  if(!team) return <span style={{fontSize:10,color:T.color.textMuted,fontStyle:"italic",padding:"2px 6px"}}>?</span>;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,background:`rgba(${c==="gold"?"245,197,24":"167,139,250"},0.1)`,border:`1px solid ${c==="gold"?"rgba(245,197,24,0.25)":"rgba(167,139,250,0.3)"}`,borderRadius:T.radius.full,padding:"2px 7px",fontSize:9,color:c==="gold"?T.color.gold:T.color.third,fontFamily:T.font.display,letterSpacing:0.5}}>
      {team.flag} {team.name}
    </span>
  );
}
 
export function R32View() {
  const {r32Matches,pickWinner} = useR32();
  const pairs = Array.from({length:8},(_,i)=>({
    r16:i+1, m0:r32Matches[i*2], m1:r32Matches[i*2+1], i0:i*2, i1:i*2+1,
  }));
 
  const sourceLabel = (match, side) => side === "home" ? (match.homeLabel ?? "?") : (match.awayLabel ?? "?");
 
  return (
    <div>
      <div style={{background:T.color.infoDim,border:`1px solid ${T.color.infoBorder}`,borderRadius:T.radius.lg,padding:`${T.space.sm}px ${T.space.md}px`,marginBottom:T.space.lg,display:"flex",alignItems:"center",gap:T.space.sm}}>
        <span style={{fontSize:15,flexShrink:0}}>🔄</span>
        <p style={{fontSize:12,color:T.color.info,lineHeight:1.6}}>
          Times derivados automaticamente dos standings. Os <strong style={{color:T.color.third}}>8 melhores 3ºs colocados</strong> entre os 12 grupos também avançam. Clique no time para avançá-lo às oitavas.
        </p>
      </div>
 
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:T.space.lg}}>
        {pairs.map(({r16:r16Idx,m0,m1,i0,i1})=>(
          <div key={r16Idx} style={{background:T.color.surface,border:`1px solid ${T.color.border}`,borderRadius:T.radius.lg,overflow:"hidden"}}>
            <div style={{padding:`${T.space.sm}px ${T.space.md}px`,background:"rgba(245,197,24,0.05)",borderBottom:`1px solid ${T.color.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:T.font.display,fontSize:11,letterSpacing:2,color:T.color.gold,textTransform:"uppercase"}}>→ Oitava {r16Idx}</span>
              <span style={{fontSize:9,color:T.color.textMuted}}>clique para avançar</span>
            </div>
 
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
              {[{match:m0,idx:i0,fix:R32_FIXTURE_BASES[i0]},{match:m1,idx:i1,fix:R32_FIXTURE_BASES[i1]}].map(({match,idx,fix},col)=>(
                <div key={idx} style={{padding:T.space.sm,borderRight:col===0?`1px solid ${T.color.border}`:"none"}}>
                  <div style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontFamily:T.font.display,fontSize:9,color:T.color.textMuted,letterSpacing:1,textTransform:"uppercase"}}>{fix.label}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",gap:2}}>
                      <span style={{fontSize:8,background:T.color.infoDim,color:T.color.info,padding:"1px 4px",borderRadius:T.radius.full,fontFamily:T.font.display}}>{sourceLabel(match,"home")}</span>
                      <span style={{fontSize:8,background:fix.away.type==="bestThird"?T.color.thirdDim:T.color.infoDim,color:fix.away.type==="bestThird"?T.color.third:T.color.info,padding:"1px 4px",borderRadius:T.radius.full,fontFamily:T.font.display}}>{sourceLabel(match,"away")}</span>
                    </div>
                  </div>
                  <BracketMatchCard match={match} onPick={w=>pickWinner(idx,w)} compact/>
                </div>
              ))}
            </div>
 
            <div style={{padding:`${T.space.xs}px ${T.space.md}px ${T.space.sm}px`,borderTop:`1px solid ${T.color.border}`,display:"flex",gap:T.space.sm,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:9,color:T.color.textMuted,fontFamily:T.font.display,letterSpacing:1}}>OITAVA {r16Idx}:</span>
              <TeamPill team={m0.winner} color="gold"/>
              <span style={{fontSize:9,color:T.color.textMuted}}>×</span>
              <TeamPill team={m1.winner} color="gold"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
