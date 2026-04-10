import { GROUP_KEYS } from "../../domain/data";
import { ProgressBar } from "../ui/Primitives";
import { T } from "../ui/tokens";

export function GroupSelector({activeGroup,groupProgress,onSelect}) {
  return (
    <div style={{display:"flex",gap:T.space.xs,flexWrap:"wrap",marginBottom:T.space.lg}}>
      {GROUP_KEYS.map(key=>{
        const active=key===activeGroup;
        const {finished,total}=groupProgress[key];
        return <button key={key} onClick={()=>onSelect(key)}
          style={{padding:`6px 14px`,borderRadius:T.radius.full,border:`1px solid ${active?T.color.gold:T.color.border}`,cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:T.font.display,letterSpacing:1,transition:"all .2s",background:active?T.color.gold:"transparent",color:active?"#0a0a14":T.color.textDim,boxShadow:active?`0 0 16px ${T.color.goldGlow}`:"none",minWidth:76,textAlign:"center"}}>
          <div>Grupo {key}</div>
          <ProgressBar value={finished} max={total}/>
          <div style={{fontSize:8,marginTop:2,opacity:0.7}}>{finished===total?"✓":`${finished}/${total}`}</div>
        </button>;
      })}
    </div>
  );
}
