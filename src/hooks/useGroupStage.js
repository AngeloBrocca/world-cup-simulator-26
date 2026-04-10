import { useMemo } from "react";
import { useTournament, ACTIONS } from "../store/tournamentStore";
import { GROUPS, GROUP_KEYS } from "../domain/data";
import { calculateStandings } from "../services/tournamentService";

export function useGroupStage() {
  const {state,dispatch} = useTournament();
  const {activeGroup,groupMatches} = state;
  const standings = useMemo(()=>calculateStandings(GROUPS[activeGroup],groupMatches[activeGroup]),[activeGroup,groupMatches]);
  const groupProgress = useMemo(()=>Object.fromEntries(GROUP_KEYS.map(k=>{const m=groupMatches[k];return [k,{finished:m.filter(x=>x.homeGoals!==null).length,total:m.length}];})),[groupMatches]);
  return {
    activeGroup, currentMatches:groupMatches[activeGroup], standings, groupProgress,
    setActiveGroup:(g)=>dispatch({type:ACTIONS.SET_GROUP,payload:g}),
    updateScore:(matchId,side,goals)=>dispatch({type:ACTIONS.SET_SCORE,payload:{group:activeGroup,matchId,side,goals}}),
  };
}
