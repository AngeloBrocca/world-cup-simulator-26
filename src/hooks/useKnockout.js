import { useMemo } from "react";
import { useTournament, ACTIONS } from "../store/tournamentStore";

export function useKnockout() {
  const {state,dispatch} = useTournament();
  const {knockoutBracket} = state;
  const champion = useMemo(()=>knockoutBracket.final[0]?.winner??null,[knockoutBracket]);
  return {
    knockoutBracket, roundOrder:["r16","qf","sf","final"], champion,
    pickWinner:(round,matchIndex,winner)=>dispatch({type:ACTIONS.PICK_WINNER,payload:{round,matchIndex,winner}}),
  };
}
