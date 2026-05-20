import { useKnockout } from "../../hooks/useKnockout";
import { T } from "../ui/tokens";
import { SectionLabel } from "../ui/Primitives";
import { ROUND_LABELS } from "../../domain/types";
import {BracketMatchCard} from "./BracketMatchCard";
import { useR32 } from "../../hooks/useR32";

export function KnockoutView() {
  const {knockoutBracket,champion,pickWinner}=useKnockout();
  const {r32Matches,pickWinner:pickR32}=useR32();
  const roundOrder=["r16","qf","sf","final"];
  return (
    <div style={{overflowX:"auto",paddingBottom:T.space.md}}>
      <div style={{display:"flex",gap:T.space.md,alignItems:"stretch",minWidth:"max-content"}}>
        {/* 16-avos */}
        <div style={{flexShrink:0,width:210}}>
          <SectionLabel style={{whiteSpace:"nowrap"}}>{ROUND_LABELS.r32}</SectionLabel>
          <div style={{display:"flex",flexDirection:"column",gap:T.space.xs}}>
            {r32Matches.map((match,i)=>(
              <div key={match.id}>
                <BracketMatchCard match={match} onPick={w=>pickR32(i,w)} compact />
                {i%2===1&&i<15&&<div style={{height:T.space.sm,borderBottom:`1px dashed rgba(255,255,255,0.05)`,marginBottom:T.space.xs}}/>}
              </div>
            ))}
          </div>
        </div>
        {/* Oitavas → Final */}
        {roundOrder.map(round=>(
          <div key={round} style={{flexShrink:0,width:210,display:"flex",flexDirection:"column"}}>
            <SectionLabel style={{whiteSpace:"nowrap"}}>{ROUND_LABELS[round]}</SectionLabel>
            <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-around"}}>
              {knockoutBracket[round].map((match,i)=>(
                <BracketMatchCard key={match.id} match={match} onPick={w=>pickWinner(round,i,w)}/>
              ))}
            </div>
          </div>
        ))}
        {/* Campeão */}
        {champion&&(
          <div style={{flexShrink:0,width:170,display:"flex",flexDirection:"column"}}>
            <SectionLabel style={{whiteSpace:"nowrap",textAlign:"center"}}>🏆 Campeão</SectionLabel>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:T.color.goldDim,border:`2px solid ${T.color.gold}`,borderRadius:T.radius.lg,padding:`${T.space.lg}px ${T.space.md}px`,textAlign:"center",boxShadow:`0 0 50px ${T.color.goldGlow}`,width:"100%"}}>
                <div style={{fontSize:44,marginBottom:T.space.sm}}>{champion.flag}</div>
                <div style={{fontFamily:T.font.display,fontSize:16,fontWeight:700,color:T.color.gold,letterSpacing:1,lineHeight:1.3}}>{champion.name}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

