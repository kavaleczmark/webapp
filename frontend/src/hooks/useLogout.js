import { useAuthContext } from "./useAuthContext"
import Cookie from "js-cookie";
export const useLogout = () => {
    const {dispatch} = useAuthContext();
    const logout = () => {
        localStorage.removeItem("user");
        Cookie.remove('refresh',{path: '/',domain: 'localhost'});
        Cookie.remove('user',{path: '/',domain: 'localhost'});
        dispatch({type: "LOGOUT"});
    }
    return {logout};
}