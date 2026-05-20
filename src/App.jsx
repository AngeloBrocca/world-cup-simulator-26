import { TournamentProvider } from "./store/tournamentStore";
import { useAppNavigation } from "./hooks/useAppNavigation";

import {AppHeader} from "./components/ui/AppHeader";
import {GroupStageView} from "./components/groups/GroupStageView";
import {R32View} from "./components/bracket/R32View";
import {KnockoutView} from "./components/bracket/KnockoutView";
import { T } from "./components/ui/tokens";
import { TabButton } from "./components/ui/Primitives";

const TABS = [
  {id:"groups",  label:"⚽ Fase de Grupos"},
  {id:"knockout",label:"🏆 Mata-Mata"},
];
 
function AppShell() {
  const {view,setView,resetTournament}=useAppNavigation();
  return (
    <div style={{minHeight:"100vh",background:T.color.bg,fontFamily:T.font.body,color:T.color.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        ::-webkit-scrollbar{height:4px;width:4px;background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(245,197,24,0.25);border-radius:4px;}
        
        .tabs-nav::-webkit-scrollbar {
          display: none;
        }
        .tabs-nav {
          scrollbar-width: none;
        }
        img {
          width: 14px;
          height: 14px;
          object-fit: contain;
        }
        div > div > img {
          width: 64px !important;
          height: 64px !important;
        }
      `}</style>
      <AppHeader onReset={resetTournament}/>
      <main style={{maxWidth:1200,margin:"0 auto",padding:`0 ${T.space.lg}px ${T.space.xl*2}px`}}>
        <nav style={{display:"flex",borderBottom:`1px solid ${T.color.border}`,marginBottom:T.space.lg,marginTop:T.space.lg,overflowX:"auto"}}>
          {TABS.map(({id,label})=><TabButton key={id} active={view===id} onClick={()=>setView(id)}>{label}</TabButton>)}
        </nav>
        {view==="groups"   && <GroupStageView/>}
        {view==="knockout" && <KnockoutView/>}
      </main>
    </div>
  );
}
 
export default function App() {
  return <TournamentProvider><AppShell/></TournamentProvider>;
}
