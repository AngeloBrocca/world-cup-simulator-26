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
    .map(k => ({ groupKey: k, standing: allStandings[k]?.[2] ?? null }))
    .filter(x => x.standing !== null);
 
  thirds.sort((a, b) =>
    b.standing.points        - a.standing.points ||
    b.standing.goalDifference - a.standing.goalDifference ||
    b.standing.goalsFor      - a.standing.goalsFor ||
    a.groupKey.localeCompare(b.groupKey)
  );
 
  return thirds.slice(0, 8);
}
 
/**
 * Deriva os 16 confrontos da R32 a partir dos standings e dos winners salvos.
 * Usa o Anexo C da FIFA para mapear os 8 melhores 3ºs aos slots corretos.
 * Enquanto os grupos ainda estão em andamento, exibe o estado atual (preview).
 */

export function deriveR32Matches(allStandings, savedWinners) {
  const first  = Object.fromEntries(GROUP_KEYS.map(k => [k, allStandings[k]?.[0]?.team ?? null]));
  const second = Object.fromEntries(GROUP_KEYS.map(k => [k, allStandings[k]?.[1]?.team ?? null]));
 
  const best8       = selectBest8Thirds(allStandings);
  const best8Groups = best8.map(x => x.groupKey);
 
  // Resolve qual grupo alimenta cada slot de bestThird via Anexo C
  const slotToGroup = resolveThirdSlots(best8Groups); // array[8]
 
  // Mapa groupKey → team para os 8 melhores 3ºs
  const thirdTeamByGroup = Object.fromEntries(
    best8.map(x => [x.groupKey, x.standing?.team ?? null])
  );
 
  return R32_FIXTURE_BASES.map((fix, i) => {
    const resolveSlot = (src) => {
      if (src.type === "winner")    return first[src.g]  ?? null;
      if (src.type === "runnerUp")  return second[src.g] ?? null;
      if (src.type === "bestThird") {
        const groupForSlot = slotToGroup[src.slot] ?? null;
        return groupForSlot ? (thirdTeamByGroup[groupForSlot] ?? null) : null;
      }
      return null;
    };
 
    const home = resolveSlot(fix.home);
    const away = resolveSlot(fix.away);
    const saved = savedWinners[i];
    const winnerValid = saved && ((home?.id === saved.id) || (away?.id === saved.id));
 
    // Constrói labels descritivos dos slots para exibição na UI
    const homeLabel = fix.home.type === "winner"    ? `1º Grp ${fix.home.g}`
                    : fix.home.type === "runnerUp"  ? `2º Grp ${fix.home.g}`
                    : null;
    const awayLabel = fix.away.type === "runnerUp"  ? `2º Grp ${fix.away.g}`
                    : fix.away.type === "bestThird" ? (() => {
                        const g = slotToGroup[fix.away.slot];
                        const rank = best8Groups.indexOf(g);
                        return g ? `3º Grp ${g}${rank >= 0 ? ` (${rank+1}º melhor)` : ""}` : "3º melhor";
                      })()
                    : null;
 
    return {
      id: fix.id, round: "r32", position: i, label: fix.label,
      homeLabel, awayLabel,
      home, away,
      winner: winnerValid ? saved : null,
    };
  });
}
 
export function deriveR16FromR32(r32Winners, currentBracket) {
  let bracket = {...currentBracket};
  for (let i=0; i<16; i++) {
    const newTeam = r32Winners[i] ?? null;
    const r16Index = Math.floor(i/2);
    const slot = i%2===0 ? "home" : "away";
    const currentTeam = bracket.r16[r16Index][slot] ?? null;
    if ((currentTeam?.id??null) !== (newTeam?.id??null)) {
      bracket = clearDownstream(bracket, "r16", r16Index);
      bracket = {...bracket, r16: bracket.r16.map((m,idx)=>idx!==r16Index?m:{...m,[slot]:newTeam,winner:null})};
    }
  }
  return bracket;
}