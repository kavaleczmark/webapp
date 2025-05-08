import { useState } from 'react';
import { instance as axios } from '../api/axios';
import { useAuthContext } from './useAuthContext';


export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isFinished, setIsFinished] = useState(null);
    const {dispatch} = useAuthContext();

    const login = async (userName, password) => {
        setIsLoading(true);
        setError(null);
        setIsFinished(false);
        axios.post("user/login", {
            username : `${userName}`,
            password : `${password}`
        }).then(function(response){
            if(response.status === 200) {
                localStorage.setItem("user", JSON.stringify(response.data));
                dispatch({
                    type: "LOGIN",
                    payload: response
                })
                setIsLoading(false);
                setIsFinished(true);
                console.log(response);
            }
        }).catch(function(error){
            console.log(error.response);
            setIsLoading(false);
            setIsFinished(true);
            setError(error.response.data.error);
            
        });
    }
    return {login,isLoading,isFinished,error};
}