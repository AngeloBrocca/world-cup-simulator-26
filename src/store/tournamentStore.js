import { createContext, useReducer, useContext, useMemo } from "react";
import { GROUP_KEYS, GROUPS } from "../domain/data";
import { generateGroupMatches, generateKnockoutBracket, advanceWinner, clearDownstream } from "../services/tournamentService";
import { deriveR16FromR32 } from "../services/seedingService";


export const ACTIONS = { SET_SCORE:"SET_SCORE", SET_GROUP:"SET_GROUP", SET_VIEW:"SET_VIEW", PICK_R32:"PICK_R32", PICK_WINNER:"PICK_WINNER", RESET:"RESET" };

// ─────────────────────────────────────────────────────────────────────────────
// RESULTADOS JÁ DISPUTADOS — adicione aqui os placares confirmados.
// Chave: "ID_HOME-vs-ID_AWAY"  (mesma lógica de generateGroupMatches)
// ─────────────────────────────────────────────────────────────────────────────
const PRESET_SCORES = {
  // Rodada 1
  "MEX-vs-RSA": { homeGoals: 2, awayGoals: 0 },
  "KOR-vs-CZE": { homeGoals: 2, awayGoals: 1 },
  "CAN-vs-BIH": { homeGoals: 1, awayGoals: 1 },
  "QAT-vs-SUI": { homeGoals: 1, awayGoals: 1 },
  "BRA-vs-MAR": { homeGoals: 1, awayGoals: 1 },
  "HTI-vs-SCO": { homeGoals: 0, awayGoals: 1 },
  "AUS-vs-TUR": { homeGoals: 2, awayGoals: 0 },
  "GER-vs-CUW": { homeGoals: 7, awayGoals: 1 },
  "CIV-vs-ECU": { homeGoals: 2, awayGoals: 2 },
  "NED-vs-JPN": { homeGoals: 1, awayGoals: 0 },
  "SWE-vs-TUN": { homeGoals: 5, awayGoals: 1 },
};

function applyPresetScores(groupMatches) {
  const updated = {};
  for (const [group, matches] of Object.entries(groupMatches)) {
    updated[group] = matches.map(m => {
      const preset = PRESET_SCORES[m.id];
      return preset ? { ...m, ...preset } : m;
    });
  }
  return updated;
}


function buildInitialState() {
  const rawMatches = Object.fromEntries(GROUP_KEYS.map(k => [k, generateGroupMatches(GROUPS[k])]));
  return {
    view:"groups", activeGroup:"A",
    groupMatches: applyPresetScores(rawMatches),
    r32Winners:Array(16).fill(null),
    knockoutBracket:generateKnockoutBracket(),
  };
}

 
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_VIEW:  return {...state, view:action.payload};
    case ACTIONS.SET_GROUP: return {...state, activeGroup:action.payload};
    case ACTIONS.SET_SCORE: {
      const {group,matchId,side,goals} = action.payload;
      return {...state, groupMatches:{...state.groupMatches,[group]:state.groupMatches[group].map(m=>m.id===matchId?{...m,[side]:goals}:m)}};
    }
    case ACTIONS.PICK_R32: {
      const updated=[...state.r32Winners];
      updated[action.payload.matchIndex]=action.payload.winner;
      return {...state, r32Winners:updated, knockoutBracket:deriveR16FromR32(updated,state.knockoutBracket)};
    }
    case ACTIONS.PICK_WINNER: {
      const {round,matchIndex,winner}=action.payload;
      return {...state, knockoutBracket:advanceWinner(clearDownstream(state.knockoutBracket,round,matchIndex),round,matchIndex,winner)};
    }
    case ACTIONS.RESET: return buildInitialState();
    default: return state;
  }
}
 
const TournamentContext = createContext(null);
export function TournamentProvider({children}) {
  const [state,dispatch] = useReducer(reducer,undefined,buildInitialState);
  const value = useMemo(()=>({state,dispatch}),[state]);
  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}
export function useTournament() {
  const ctx=useContext(TournamentContext);
  if(!ctx) throw new Error("useTournament must be inside TournamentProvider");
  return ctx;
}
