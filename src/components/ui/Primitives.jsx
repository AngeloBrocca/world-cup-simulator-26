import { T } from "./tokens";

function ScoreInput({value,onChange}) {
  return (
    <input type="number" min="0" max="20"
      value={value===null||value===undefined?"":value}
      onChange={e=>onChange(e.target.value===""?null:Math.max(0,parseInt(e.target.value)||0))}
      style={{width:44,textAlign:"center",background:"rgba(255,255,255,0.06)",border:`1px solid ${T.color.border}`,borderRadius:T.radius.sm,color:T.color.text,fontSize:18,fontWeight:700,padding:"5px 0",fontFamily:T.font.display,outline:"none",transition:"border .15s"}}
      onFocus={e=>e.target.style.borderColor=T.color.gold}
      onBlur={e=>e.target.style.borderColor=T.color.border}
    />
  );
}
 
function SectionLabel({children,style}) {
  return <p style={{fontFamily:T.font.display,fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:T.color.gold,marginBottom:T.space.md,...style}}>{children}</p>;
}
 
function TabButton({active,onClick,children}) {
  return <button onClick={onClick} style={{background:"none",border:"none",borderBottom:`2px solid ${active?T.color.gold:"transparent"}`,cursor:"pointer",fontFamily:T.font.body,fontSize:14,fontWeight:600,padding:`${T.space.sm}px ${T.space.md}px`,color:active?T.color.gold:T.color.textMuted,marginBottom:-1,transition:"color .2s,border-color .2s",whiteSpace:"nowrap"}}>{children}</button>;
}
 
function ProgressBar({value,max}) {
  const pct=max===0?0:(value/max)*100;
  return <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:T.radius.full,overflow:"hidden",marginTop:5}}><div style={{height:"100%",width:`${pct}%`,background:pct===100?T.color.win:T.color.gold,borderRadius:T.radius.full,transition:"width .4s ease"}}/></div>;
}

export {
  ScoreInput,
  SectionLabel,
  TabButton,
  ProgressBar
};