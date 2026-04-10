import { useMemo } from "react";
import { useTournament, ACTIONS } from "../store/tournamentStore";
import { GROUPS, GROUP_KEYS } from "../domain/data";
import { calculateStandings } from "../services/tournamentService";
import { deriveR32Matches, selectBest8Thirds } from "../services/seedingService";

export function useR32() {
  const {state,dispatch} = useTournament();
  const {groupMatches,r32Winners} = state;
  const allStandings = useMemo(()=>Object.fromEntries(GROUP_KEYS.map(k=>[k,calculateStandings(GROUPS[k],groupMatches[k])])),[groupMatches]);
  const r32Matches = useMemo(()=>deriveR32Matches(allStandings,r32Winners),[allStandings,r32Winners]);
  const best8 = useMemo(()=>selectBest8Thirds(allStandings),[allStandings]);
  return {
    r32Matches, best8,
    pickWinner:(matchIndex,winner)=>dispatch({type:ACTIONS.PICK_R32,payload:{matchIndex,winner}}),
  };
}
