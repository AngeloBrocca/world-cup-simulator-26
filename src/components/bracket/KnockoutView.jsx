import { useKnockout } from "../../hooks/useKnockout";
import { T } from "../ui/tokens";
import { SectionLabel } from "../ui/Primitives";
import { ROUND_LABELS } from "../../domain/types";
import {BracketMatchCard} from "./BracketMatchCard";

export function KnockoutView() {
  const {knockoutBracket,roundOrder,champion,pickWinner} = useKnockout();
  return (
    <div>
      <p style={{color:T.color.textMuted,fontSize:13,marginBottom:T.space.lg}}>Times preenchidos pelos vencedores dos 16-avos. Clique para avançar.</p>
      <div style={{display:"flex",gap:T.space.lg,overflowX:"auto",paddingBottom:T.space.md,alignItems:"flex-start"}}>
        {roundOrder.map(round=>(
          <div key={round} style={{minWidth:200,flexShrink:0}}>
            <SectionLabel>{ROUND_LABELS[round]}</SectionLabel>
            <div style={{display:"flex",flexDirection:"column",gap:T.space.sm}}>
              {knockoutBracket[round].map((match,i)=>(
                <BracketMatchCard key={match.id} match={match} onPick={w=>pickWinner(round,i,w)}/>
              ))}
            </div>
          </div>
        ))}
        {champion && (
          <div style={{minWidth:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:32,flexShrink:0}}>
            <SectionLabel style={{textAlign:"center"}}>🏆 Campeão</SectionLabel>
            <div style={{background:T.color.goldDim,border:`2px solid ${T.color.gold}`,borderRadius:T.radius.lg,padding:`${T.space.lg}px ${T.space.xl}px`,textAlign:"center",boxShadow:`0 0 50px ${T.color.goldGlow}`}}>
              <div style={{fontSize:48,marginBottom:T.space.sm}}>{champion.flag}</div>
              <div style={{fontFamily:T.font.display,fontSize:18,fontWeight:700,color:T.color.gold,letterSpacing:1}}>{champion.name}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
