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
  // GRUPO A
  "MEX-vs-RSA": { homeGoals: 2, awayGoals: 0 },
  "KOR-vs-CZE": { homeGoals: 2, awayGoals: 1 },
  "MEX-vs-KOR": { homeGoals: 1, awayGoals: 0 },
  "RSA-vs-CZE": { homeGoals: 1, awayGoals: 1 },
  // "MEX-vs-CZE": { homeGoals: 0, awayGoals: 0 },
  // "RSA-vs-KOR": { homeGoals: 0, awayGoals: 0 },

  // GRUPO B
  "CAN-vs-BIH": { homeGoals: 1, awayGoals: 1 },
  "QAT-vs-SUI": { homeGoals: 1, awayGoals: 1 },
  "CAN-vs-QAT": { homeGoals: 6, awayGoals: 0 },
  "BIH-vs-SUI": { homeGoals: 1, awayGoals: 4 },
  // "CAN-vs-SUI": { homeGoals: 0, awayGoals: 0 },
  // "BIH-vs-QAT": { homeGoals: 0, awayGoals: 0 },

  // GRUPO C
  "BRA-vs-MAR": { homeGoals: 1, awayGoals: 1 },
  "HTI-vs-SCO": { homeGoals: 0, awayGoals: 1 },
  "BRA-vs-HTI": { homeGoals: 3, awayGoals: 0 },
  "MAR-vs-SCO": { homeGoals: 1, awayGoals: 0 },
  // "BRA-vs-SCO": { homeGoals: 0, awayGoals: 0 },
  // "MAR-vs-HTI": { homeGoals: 0, awayGoals: 0 },

  // GRUPO D
  "AUS-vs-TUR": { homeGoals: 2, awayGoals: 0 },
  "USA-vs-PAR": { homeGoals: 4, awayGoals: 1 },
  "USA-vs-AUS": { homeGoals: 2, awayGoals: 0 },
  "PAR-vs-TUR": { homeGoals: 1, awayGoals: 0 },
  // "USA-vs-TUR": { homeGoals: 0, awayGoals: 0 },
  // "PAR-vs-AUS": { homeGoals: 0, awayGoals: 0 },

  // GRUPO E
  "GER-vs-CUW": { homeGoals: 7, awayGoals: 1 },
  "CIV-vs-ECU": { homeGoals: 2, awayGoals: 2 },
  "GER-vs-CIV": { homeGoals: 2, awayGoals: 1 },
  "CUW-vs-ECU": { homeGoals: 0, awayGoals: 0 },
  // "GER-vs-ECU": { homeGoals: 0, awayGoals: 0 },
  // "CUW-vs-CIV": { homeGoals: 0, awayGoals: 0 },

  // GRUPO F
  "NED-vs-JPN": { homeGoals: 1, awayGoals: 0 },
  "SWE-vs-TUN": { homeGoals: 5, awayGoals: 1 },
  "NED-vs-SWE": { homeGoals: 5, awayGoals: 1 },
  "JPN-vs-TUN": { homeGoals: 4, awayGoals: 0 },
  // "NED-vs-TUN": { homeGoals: 0, awayGoals: 0 },
  // "JPN-vs-SWE": { homeGoals: 0, awayGoals: 0 },

  // GRUPO G
  "BEL-vs-EGY": { homeGoals: 1, awayGoals: 1 },
  "IRN-vs-NZL": { homeGoals: 2, awayGoals: 2 },
  "BEL-vs-IRN": { homeGoals: 0, awayGoals: 0 },
  // "EGY-vs-NZL": { homeGoals: 0, awayGoals: 0 },
  // "BEL-vs-NZL": { homeGoals: 0, awayGoals: 0 },
  // "EGY-vs-IRN": { homeGoals: 0, awayGoals: 0 },

  // GRUPO H
  "ESP-vs-CPV": { homeGoals: 0, awayGoals: 0 },
  "KSA-vs-URU": { homeGoals: 1, awayGoals: 1 },
  "ESP-vs-KSA": { homeGoals: 4, awayGoals: 0 },
  "CPV-vs-URU": { homeGoals: 2, awayGoals: 2 },
  // "ESP-vs-URU": { homeGoals: 0, awayGoals: 0 },
  // "CPV-vs-KSA": { homeGoals: 0, awayGoals: 0 },

  // GRUPO I
  "FRA-vs-SEN": { homeGoals: 3, awayGoals: 1 },
  "IRQ-vs-NOR": { homeGoals: 1, awayGoals: 4 },
  // "FRA-vs-IRQ": { homeGoals: 0, awayGoals: 0 },
  // "SEN-vs-NOR": { homeGoals: 0, awayGoals: 0 },
  // "FRA-vs-NOR": { homeGoals: 0, awayGoals: 0 },
  // "SEN-vs-IRQ": { homeGoals: 0, awayGoals: 0 },

  // GRUPO J
  "ARG-vs-ALG": { homeGoals: 3, awayGoals: 0 },
  "AUT-vs-JOR": { homeGoals: 3, awayGoals: 1 },
  // "ARG-vs-AUT": { homeGoals: 0, awayGoals: 0 },
  // "ALG-vs-JOR": { homeGoals: 0, awayGoals: 0 },
  // "ARG-vs-JOR": { homeGoals: 0, awayGoals: 0 },
  // "ALG-vs-AUT": { homeGoals: 0, awayGoals: 0 },

  // GRUPO K
  "POR-vs-COD": { homeGoals: 1, awayGoals: 1 },
  "UZB-vs-COL": { homeGoals: 1, awayGoals: 3 },
  // "POR-vs-UZB": { homeGoals: 0, awayGoals: 0 },
  // "COD-vs-COL": { homeGoals: 0, awayGoals: 0 },
  // "POR-vs-COL": { homeGoals: 0, awayGoals: 0 },
  // "COD-vs-UZB": { homeGoals: 0, awayGoals: 0 },

  // GRUPO L
  "ENG-vs-CRO": { homeGoals: 4, awayGoals: 2 },
  "GHA-vs-PAN": { homeGoals: 1, awayGoals: 0 },
  // "ENG-vs-GHA": { homeGoals: 0, awayGoals: 0 },
  // "CRO-vs-PAN": { homeGoals: 0, awayGoals: 0 },
  // "ENG-vs-PAN": { homeGoals: 0, awayGoals: 0 },
  // "CRO-vs-GHA": { homeGoals: 0, awayGoals: 0 },
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
