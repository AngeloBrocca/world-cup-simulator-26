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

 
/**
 * Deriva os 16 confrontos da R32 a partir dos standings e dos winners salvos.
 * Usa o Anexo C da FIFA para mapear os 8 melhores 3ºs aos slots corretos.
 * Enquanto os grupos ainda estão em andamento, exibe o estado atual (preview).
 */

export function deriveR32Matches(allStandings, savedWinners) {
  const first  = Object.fromEntries(GROUP_KEYS.map(k=>[k,allStandings[k]?.[0]?.team??null]));
  const second = Object.fromEntries(GROUP_KEYS.map(k=>[k,allStandings[k]?.[1]?.team??null]));
  const best8       = selectBest8Thirds(allStandings);
  const best8Groups = best8.map(x=>x.groupKey);
  const thirdSlots  = resolveThirdSlots(best8Groups);
  const thirdTeam   = Object.fromEntries(best8.map(x=>[x.groupKey,x.standing?.team??null]));
 
  return R32_FIXTURE_BASES.map((fix,i)=>{
    const resolve = src => {
      if (src.type === "winner")
        return first[src.g];

      if (src.type === "runnerUp")
        return second[src.g];

      if (src.type === "bestThird") {
        const tg = thirdSlots[src.w];
        return thirdTeam[tg];
      }
    };
    const home=resolve(fix.home), away=resolve(fix.away);
    const saved=savedWinners[i];
    const winnerValid=saved&&((home?.id===saved.id)||(away?.id===saved.id));
 
    const homeLabel = fix.home.type==="winner"   ? `1º Grp ${fix.home.g}`
                    : fix.home.type==="runnerUp" ? `2º Grp ${fix.home.g}` : null;
    const awayLabel = fix.away.type==="runnerUp"  ? `2º Grp ${fix.away.g}`
                    : fix.away.type==="bestThird" ? (()=>{
                        const tg=thirdSlots[fix.away.w];
                        const rank=tg?best8Groups.indexOf(tg):-1;
                        return tg?`3º Grp ${tg}${rank>=0?` (${rank+1}º melhor)`:""}` : "3º (a definir)";
                      })() : null;
 
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
