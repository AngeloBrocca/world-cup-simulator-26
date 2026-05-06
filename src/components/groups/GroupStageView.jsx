import { useGroupStage } from "../../hooks/useGroupStage";
import { useR32 } from "../../hooks/useR32";
import {GroupSelector} from "./GroupSelector";
import {MatchCard} from "./MatchCard";
import {StandingsTable} from "./StandingsTable";
import {Best8ThirdsPanel} from "./Best8ThirdsPanel";
import { T } from "../ui/tokens";
import { SectionLabel } from "../ui/Primitives";

export function GroupStageView() {
  const {activeGroup,currentMatches,standings,groupProgress,setActiveGroup,updateScore} = useGroupStage();
  const {best8} = useR32();
 
  // Agrupa jogos por rodada (1, 2, 3)
  const rounds = [1, 2, 3].map(r => ({
    round: r,
    matches: currentMatches.filter(m => m.round === r),
  }));
 
  return (
    <div>
      <GroupSelector activeGroup={activeGroup} groupProgress={groupProgress} onSelect={setActiveGroup}/>
      <div style={{display:"grid",gridTemplateColumns:"minmax(260px,1fr) minmax(260px,1.1fr)",gap:T.space.lg,marginBottom:T.space.lg}}>
        <div>
          <SectionLabel>⚽ Partidas — Grupo {activeGroup}</SectionLabel>
          {rounds.map(({round, matches}) => (
            <div key={round} style={{marginBottom:T.space.md}}>
              {/* Header da rodada */}
              <div style={{display:"flex",alignItems:"center",gap:T.space.sm,marginBottom:T.space.sm}}>
                <span style={{fontFamily:T.font.display,fontSize:10,fontWeight:700,color:T.color.textMuted,letterSpacing:2,textTransform:"uppercase"}}>
                  Rodada {round}
                </span>
                <div style={{flex:1,height:1,background:T.color.border}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:T.space.sm}}>
                {matches.map(m => <MatchCard key={m.id} match={m} onScoreChange={updateScore}/>)}
              </div>
            </div>
          ))}
        </div>
        <div>
          <SectionLabel>📊 Classificação</SectionLabel>
          <div style={{background:T.color.surface,border:`1px solid ${T.color.border}`,borderRadius:T.radius.lg,padding:T.space.md}}>
            <StandingsTable standings={standings} groupKey={activeGroup} best8={best8}/>
          </div>
        </div>
      </div>
      <Best8ThirdsPanel best8={best8}/>
    </div>
  );
}