import { useTournament, ACTIONS } from "../store/tournamentStore";

export function useAppNavigation() {
  const {state,dispatch} = useTournament();
  return { view:state.view, setView:v=>dispatch({type:ACTIONS.SET_VIEW,payload:v}), resetTournament:()=>dispatch({type:ACTIONS.RESET}) };
}
