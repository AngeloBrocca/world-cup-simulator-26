import { ROUND_PROGRESSION } from "../domain/types";

export function generateGroupMatches(teams) {
  const matches = [];
  for (let i = 0; i < teams.length; i++)
    for (let j = i + 1; j < teams.length; j++)
      matches.push({ id:`${teams[i].id}-vs-${teams[j].id}`, home:teams[i], away:teams[j], homeGoals:null, awayGoals:null });
  return matches;
}
 
export function calculateStandings(teams, matches) {
  const tbl = Object.fromEntries(teams.map(t => [t.id, { team:t, points:0, played:0, won:0, drawn:0, lost:0, goalsFor:0, goalsAgainst:0, goalDifference:0 }]));
  for (const m of matches) {
    if (m.homeGoals === null) continue;
    const h = tbl[m.home.id], a = tbl[m.away.id];
    h.played++; a.played++;
    h.goalsFor+=m.homeGoals; h.goalsAgainst+=m.awayGoals;
    a.goalsFor+=m.awayGoals; a.goalsAgainst+=m.homeGoals;
    h.goalDifference=h.goalsFor-h.goalsAgainst;
    a.goalDifference=a.goalsFor-a.goalsAgainst;
    if (m.homeGoals>m.awayGoals)      { h.points+=3; h.won++; a.lost++; }
    else if (m.homeGoals<m.awayGoals) { a.points+=3; a.won++; h.lost++; }
    else                              { h.points++;  h.drawn++; a.points++; a.drawn++; }
  }
  return Object.values(tbl).sort((a,b) => b.points-a.points || b.goalDifference-a.goalDifference || b.goalsFor-a.goalsFor);
}
 
export function makeEmptyRound(round, size) {
  return Array.from({length:size}, (_,i) => ({id:`${round}-${i}`, round, position:i, home:null, away:null, winner:null}));
}
 
export function generateKnockoutBracket() {
  return { r16:makeEmptyRound("r16",8), qf:makeEmptyRound("qf",4), sf:makeEmptyRound("sf",2), final:makeEmptyRound("final",1) };
}
 
export function advanceWinner(bracket, round, matchIndex, winner) {
  let next = { ...bracket, [round]: bracket[round].map((m,i) => i===matchIndex ? {...m,winner} : m) };
  if (ROUND_PROGRESSION[round]) {
    const nr = ROUND_PROGRESSION[round];
    const ni = Math.floor(matchIndex/2);
    const slot = matchIndex%2===0 ? "home" : "away";
    next = {...next, [nr]: next[nr].map((m,i) => i!==ni ? m : {...m,[slot]:winner,winner:null})};
  }
  return next;
}
 
export function clearDownstream(bracket, round, matchIndex) {
  let next = {...bracket};
  let cr=round, ci=matchIndex;
  while (ROUND_PROGRESSION[cr]) {
    const nr=ROUND_PROGRESSION[cr], ni=Math.floor(ci/2), slot=ci%2===0?"home":"away";
    next = {...next,[nr]:next[nr].map((m,i)=>i!==ni?m:{...m,[slot]:null,winner:null})};
    cr=nr; ci=ni;
  }
  return next;
}
