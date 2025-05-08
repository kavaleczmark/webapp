import { useEffect, useState } from "react";
import { instance as axios } from "../api/axios";
import { useAuthContext } from "./useAuthContext";

export const useGetUserData = () => {
    const { user } = useAuthContext();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [data, setData] = useState(null);

    const getData = async () => {
        setIsLoading(true);
        setError(null);
        setIsFinished(false);
        try {
            const response = await axios.get(`users`);
            if (response.status === 200) {
                setData(response.data.data);
                setIsFinished(true);
                setIsLoading(false);
                return response.data.data;
            }
        } catch (error) {
            console.log(error.response);
            setError(error.response?.data?.error || "Hiba történt");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getData();
        } else {
            setData(null);
            setIsFinished(false);
        }
    }, [user]);

    return { data, isLoading, isFinished, error, getData };
};
