import { GROUP_KEYS } from "../domain/data";
import { R32_FIXTURE_BASES, resolveThirdSlots } from "../domain/knockoutBracket";
import { clearDownstream } from "./tournamentService";

/**
 * Seleciona os 8 melhores 3ºs colocados entre os 12 grupos.
 * Critério FIFA: pontos → saldo de gols → gols marcados → grupo (alfa).
 * Apenas considera grupos cujos 3 jogos já foram disputados (played===3)
 * OU, se ainda em andamento, usa o estado atual para preview em tempo real.
 */
export function selectBest8Thirds(allStandings) {
  const thirds = GROUP_KEYS
    .map(k=>({groupKey:k, standing:allStandings[k]?.[2]??null}))
    .filter(x=>x.standing!==null);
  thirds.sort((a,b)=>b.standing.points-a.standing.points||b.standing.goalDifference-a.standing.goalDifference||b.standing.goalsFor-a.standing.goalsFor||a.groupKey.localeCompare(b.groupKey));
  return thirds.slice(0,8);
}

// Mapa: grupo do vencedor → índice da fixture R32 que tem bestThird naquele slot
const WINNER_SLOT_TO_R32_INDEX = { A:10, B:14, D:6, E:0, G:7, I:1, K:15, L:11 };
 
/**
 * Deriva os 16 confrontos da R32 a partir dos standings e dos winners salvos.
 * Usa o Anexo C da FIFA para mapear os 8 melhores 3ºs aos slots corretos.
 * Enquanto os grupos ainda estão em andamento, exibe o estado atual (preview).
 */

export function deriveR32Matches(allStandings, savedWinners) {
  const first  = Object.fromEntries(GROUP_KEYS.map(k=>[k,allStandings[k]?.[0]?.team??null]));
  const second = Object.fromEntries(GROUP_KEYS.map(k=>[k,allStandings[k]?.[1]?.team??null]));
 
  // best8: os 8 melhores 3ºs classificados, ordenados do melhor para o pior
  const best8       = selectBest8Thirds(allStandings);
  const best8Groups = new Set(best8.map(x=>x.groupKey));
  // thirdByGroup: groupKey -> entry do best8 (com .standing)
  const thirdByGroup = Object.fromEntries(best8.map(x=>[x.groupKey, x]));
 
  // Usa resolveThirdSlots (ANNEX_C + backtracking) para determinar qual grupo
  // de 3º enfrenta cada vencedor. O resultado é { A: grpX, B: grpY, ... }
  // onde a chave é o grupo do vencedor e o valor é o grupo do 3º classificado.
  const slots = resolveThirdSlots([...best8Groups]);
 
  // Converte o mapa de slots para assignedThird[fixtureIndex]
  const assignedThird = {}; // fixtureIndex -> entry do best8
  for (const [winnerGroup, thirdGroup] of Object.entries(slots)) {
    const fi = WINNER_SLOT_TO_R32_INDEX[winnerGroup];
    if (fi !== undefined && thirdByGroup[thirdGroup]) {
      assignedThird[fi] = thirdByGroup[thirdGroup];
    }
  }
 
  return R32_FIXTURE_BASES.map((fix,i)=>{
    const resolve = src => {
      if (src.type==="winner")    return first[src.g]??null;
      if (src.type==="runnerUp")  return second[src.g]??null;
      if (src.type==="bestThird") {
        return assignedThird[i]?.standing?.team ?? null;
      }
      return null;
    };
    const home=resolve(fix.home), away=resolve(fix.away);
    const saved=savedWinners[i];
    const winnerValid=saved&&((home?.id===saved.id)||(away?.id===saved.id));
 
    const labelFor = src => {
      if (src.type==="winner")    return `1º Grp ${src.g}`;
      if (src.type==="runnerUp")  return `2º Grp ${src.g}`;
      if (src.type==="bestThird") {
        const a = assignedThird[i];
        if (!a) return `3º (${src.eligible.join("/")})`;
        const rank = best8.findIndex(x=>x.groupKey===a.groupKey);
        return `3º Grp ${a.groupKey}${rank>=0?` (${rank+1}º melhor)`:""}`;
      }
      return null;
    };
    const homeLabel = labelFor(fix.home);
    const awayLabel = labelFor(fix.away);
 
    return {id:fix.id,round:"r32",position:i,label:fix.label,homeLabel,awayLabel,home,away,winner:winnerValid?saved:null};
  });
}


export function deriveR16FromR32(r32Winners, currentBracket) {
  let bracket={...currentBracket};
  for (let i=0;i<16;i++) {
    const newTeam=r32Winners[i]??null;
    const r16Index=Math.floor(i/2), slot=i%2===0?"home":"away";
    const currentTeam=bracket.r16[r16Index][slot]??null;
    if ((currentTeam?.id??null)!==(newTeam?.id??null)) {
      bracket=clearDownstream(bracket,"r16",r16Index);
      bracket={...bracket,r16:bracket.r16.map((m,idx)=>idx!==r16Index?m:{...m,[slot]:newTeam,winner:null})};
    }
  }
  return bracket;
}
