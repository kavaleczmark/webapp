import { useAuthContext } from "./useAuthContext"
import Cookie from "js-cookie";
export const useLogout = () => {
    const [event, setEvent, refreshEvent, eventMode, setEventMode] = useEvent();
    const {dispatch} = useAuthContext();
    const logout = () => {
        localStorage.removeItem("user");
        Cookie.remove('refresh',{path: '/',domain: 'localhost'});
        Cookie.remove('user',{path: '/',domain: 'localhost'});
        setEvent(null);
        setEventMode(false);
        dispatch({type: "LOGOUT"});
    }
    return {logout};
}