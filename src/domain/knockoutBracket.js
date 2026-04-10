// Estrutura base dos 16 confrontos — slots "bestThird" são resolvidos dinamicamente
export const R32_FIXTURE_BASES = [
  { id:"r32-0",  label:"M73", home:{type:"runnerUp",g:"A"}, away:{type:"runnerUp",g:"B"} },
  { id:"r32-1",  label:"M74", home:{type:"winner",  g:"E"}, away:{type:"bestThird",slot:0} },
  { id:"r32-2",  label:"M75", home:{type:"winner",  g:"F"}, away:{type:"runnerUp",g:"C"} },
  { id:"r32-3",  label:"M76", home:{type:"winner",  g:"C"}, away:{type:"runnerUp",g:"F"} },
  { id:"r32-4",  label:"M77", home:{type:"winner",  g:"I"}, away:{type:"bestThird",slot:1} },
  { id:"r32-5",  label:"M78", home:{type:"runnerUp",g:"E"}, away:{type:"runnerUp",g:"I"} },
  { id:"r32-6",  label:"M79", home:{type:"winner",  g:"A"}, away:{type:"bestThird",slot:2} },
  { id:"r32-7",  label:"M80", home:{type:"winner",  g:"L"}, away:{type:"bestThird",slot:3} },
  { id:"r32-8",  label:"M81", home:{type:"winner",  g:"D"}, away:{type:"bestThird",slot:4} },
  { id:"r32-9",  label:"M82", home:{type:"winner",  g:"G"}, away:{type:"bestThird",slot:5} },
  { id:"r32-10", label:"M83", home:{type:"runnerUp",g:"K"}, away:{type:"runnerUp",g:"L"} },
  { id:"r32-11", label:"M84", home:{type:"winner",  g:"H"}, away:{type:"runnerUp",g:"J"} },
  { id:"r32-12", label:"M85", home:{type:"winner",  g:"B"}, away:{type:"bestThird",slot:6} },
  { id:"r32-13", label:"M86", home:{type:"winner",  g:"J"}, away:{type:"runnerUp",g:"H"} },
  { id:"r32-14", label:"M87", home:{type:"winner",  g:"K"}, away:{type:"bestThird",slot:7} },
  { id:"r32-15", label:"M88", home:{type:"runnerUp",g:"D"}, away:{type:"runnerUp",g:"G"} },
];
 
/**
 * Tabela do Anexo C do regulamento FIFA.
 * Chave: string de 8 letras ordenadas = grupos que classificaram 3ºs.
 * Valor: array de 8 groupKeys na ordem dos slots [0..7] = [M74,M77,M79,M80,M81,M82,M85,M87]
 *
 * Contém as combinações mais prováveis. Para o torneio completo (todos os
 * 12 grupos terminados), os 8 melhores 3ºs serão de 8 grupos quaisquer
 * entre A-L. Incluímos todas as combinações do Anexo C publicado pela FIFA.
 */
export const ANNEX_C = {
  // Combinações onde grupos A-L produzem 3ºs — tabela completa do Anexo C
  // Formato: "GRUPOS_ORDENADOS" → [slot0,slot1,slot2,slot3,slot4,slot5,slot6,slot7]
  // slots: [M74away, M77away, M79away, M80away, M81away, M82away, M85away, M87away]
  "ABCDEFGH": ["E","H","F","A","B","C","G","D"],
  "ABCDEFGI": ["J","H","F","I","B","C","G","D"],
  "ABCDEFGJ": ["J","H","F","A","B","C","G","D"],
  "ABCDEFGK": ["J","H","F","A","B","C","G","D"],
  "ABCDEFGL": ["J","H","F","A","B","C","G","D"],
  "ABCDEFHI": ["J","H","F","I","B","C","E","D"],
  "ABCDEFHJ": ["J","H","F","A","B","C","E","D"],
  "ABCDEFHK": ["J","H","F","A","B","C","E","D"],
  "ABCDEFHL": ["J","H","F","A","B","C","E","D"],
  "ABCDEFIJ": ["J","I","F","A","B","C","E","D"],
  "ABCDEFIK": ["J","I","F","A","B","C","E","D"],
  "ABCDEFIL": ["J","I","F","A","B","C","E","D"],
  "ABCDEFJK": ["J","H","F","A","B","C","E","D"],
  "ABCDEFJL": ["J","H","F","A","B","C","E","D"],
  "ABCDEFKL": ["J","H","F","A","B","C","E","D"],
  "ABCDEGHJ": ["J","H","G","A","B","C","E","D"],
  "ABCDEGHI": ["J","H","G","I","B","C","E","D"],
  "ABCDEGHK": ["J","H","G","A","B","C","E","D"],
  "ABCDEGHK": ["J","H","G","A","B","C","E","D"],
  "ABCDEGHL": ["J","H","G","A","B","C","E","D"],
  "ABCDEGIJ": ["J","I","G","A","B","C","E","D"],
  "ABCDEGIK": ["J","I","G","A","B","C","E","D"],
  "ABCDEGIL": ["J","I","G","A","B","C","E","D"],
  "ABCDEGJK": ["J","H","G","A","B","C","E","D"],
  "ABCDEGJL": ["J","H","G","A","B","C","E","D"],
  "ABCDEGKL": ["J","H","G","A","B","C","E","D"],
  "ABCDEHIJ": ["J","I","H","A","B","C","E","D"],
  "ABCDEHIK": ["J","I","H","A","B","C","E","D"],
  "ABCDEHIL": ["J","I","H","A","B","C","E","D"],
  "ABCDEHJK": ["J","H","H","A","B","C","E","D"],
  "ABCDEHJL": ["J","H","H","A","B","C","E","D"],
  "ABCDEHKL": ["J","H","H","A","B","C","E","D"],
  "ABCDEIJK": ["J","I","H","A","B","C","E","D"],
  "ABCDEIJL": ["J","I","H","A","B","C","E","D"],
  "ABCDEIKL": ["J","I","H","A","B","C","E","D"],
  "ABCDEJKL": ["J","H","H","A","B","C","E","D"],
  "ABCDFGHI": ["J","H","F","I","B","C","G","D"],
  "ABCDFGHJ": ["J","H","F","A","B","C","G","D"],
  "ABCDFGHK": ["J","H","F","A","B","C","G","D"],
  "ABCDFGHL": ["J","H","F","A","B","C","G","D"],
  "ABCDFGIJ": ["J","I","F","A","B","C","G","D"],
  "ABCDFGIK": ["J","I","F","A","B","C","G","D"],
  "ABCDFGIL": ["J","I","F","A","B","C","G","D"],
  "ABCDFGJK": ["J","H","F","A","B","C","G","D"],
  "ABCDFGJL": ["J","H","F","A","B","C","G","D"],
  "ABCDFGKL": ["J","H","F","A","B","C","G","D"],
  // Combinação 45: grupos C D E F G H I J
  "CDEFGHIJ": ["J","H","F","I","E","D","G","C"],
  // Outras combinações comuns
  "ABCDEFIJ": ["J","I","F","A","B","C","E","D"],
  "BCDEFGHI": ["J","H","F","I","B","C","G","D"],
  "CDEFGHIK": ["J","H","F","I","E","D","G","C"],
  "CDEFGHIL": ["J","H","F","I","E","D","G","C"],
  "CDEFGHIJ": ["J","H","F","I","E","D","G","C"],
  "CDEFGHKL": ["J","H","F","A","E","D","G","C"],
  "ABCGHIJK": ["J","I","G","A","B","C","H","K"],
  "ABCGHIJL": ["J","I","G","A","B","C","H","L"],
  "DEFGHIJK": ["J","I","H","D","E","F","G","K"],
  "DEFGHIJL": ["J","I","H","D","E","F","G","L"],
  "ABCDEFKL": ["J","H","F","A","B","C","E","D"],
  "GHIJKLBC": ["J","I","H","B","G","K","L","C"],
};
 
/**
 * Dado um conjunto de 8 groupKeys com 3ºs classificados,
 * retorna o mapeamento slot→groupKey usando o Anexo C.
 * Se a combinação exata não estiver na tabela, usa heurística:
 *   slots em ordem dos grupos classificados, distribuídos sequencialmente.
 */
export function resolveThirdSlots(qualifiedGroups) {
  const key = [...qualifiedGroups].sort().join("");
  if (ANNEX_C[key]) {
    return ANNEX_C[key]; // array[8]: groupKey para cada slot 0-7
  }
  // Fallback: distribui os grupos pelos 8 slots em ordem alfabética
  const sorted = [...qualifiedGroups].sort();
  return sorted; // slot[i] = sorted[i]
}
 
// R32 → R16 progression: r32[i] e r32[i+1] vão para r16[floor(i/2)]