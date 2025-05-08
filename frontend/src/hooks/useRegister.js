import { useState } from 'react';
import { instance as axios } from '../api/axios';
import { useAuthContext } from './useAuthContext';

export const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isFinished, setIsFinished] = useState(null);
    const {dispatch} = useAuthContext();

    const registration = async (userName, password, repassword) => {
        setIsLoading(true);
        setError(null);
        setIsFinished(false);
        axios.post("user/registration", {
            username : `${userName}`,
            password : `${password}`,
            repassword : `${repassword}`
        }).then(function(response){
            if(response.status === 200) {
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
    return {registration,isLoading,isFinished,error};
}