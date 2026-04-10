import { T } from "./tokens";

export function AppHeader({onReset}) {
  return (
    <header style={{background:"linear-gradient(135deg, #0f0f22 0%, #141430 50%, #0e2040 100%)",padding:`${T.space.xl}px ${T.space.xl}px ${T.space.lg}px`,position:"relative",overflow:"hidden",borderBottom:`1px solid ${T.color.border}`}}>
      <div style={{position:"absolute",top:-80,right:-80,width:360,height:360,background:"radial-gradient(circle, rgba(245,197,24,0.12) 0%, transparent 65%)",borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.025,backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",backgroundSize:"32px 32px"}}/>
      <div style={{position:"relative",maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div style={{display:"flex",alignItems:"center",gap:T.space.md}}>
          <span style={{fontSize:44,lineHeight:1}}>🌎</span>
          <div>
            <h1 style={{fontFamily:T.font.display,fontSize:30,fontWeight:700,letterSpacing:3,textTransform:"uppercase",background:`linear-gradient(90deg, ${T.color.gold} 0%, #fff 70%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,margin:0}}>Copa do Mundo 2026</h1>
            <p style={{fontFamily:T.font.display,color:T.color.textMuted,fontSize:11,letterSpacing:3,textTransform:"uppercase",marginTop:6}}>48 Seleções · 12 Grupos · EUA · Canadá · México</p>
          </div>
        </div>
        <button onClick={onReset}
          style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${T.color.border}`,borderRadius:T.radius.md,color:T.color.textMuted,cursor:"pointer",fontFamily:T.font.body,fontSize:12,padding:`${T.space.xs}px ${T.space.sm}px`,transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.color.loss;e.currentTarget.style.color=T.color.loss;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.color.border;e.currentTarget.style.color=T.color.textMuted;}}>
          ↺ Reiniciar
        </button>
      </div>
    </header>
  );
}
