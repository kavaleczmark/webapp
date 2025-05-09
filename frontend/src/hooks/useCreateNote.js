import { useState } from 'react';
import { instance as axios } from '../api/axios';

export const useCreateNote = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const createNote = async (title = "Névtelen jegyzet", text = "") => {
    setIsLoading(true);
    setError(null);
    setIsFinished(false);
    axios.post("notes/create", {
      title: `${title}`,
      text: `${text}`
    })
    .then(function (response) {
      if (response.status === 200) {
        setIsLoading(false);
        setIsFinished(true);
        console.log("Jegyzet létrehozva:", response.data);
      }
    })
    .catch(function (error) {
      setIsLoading(false);
      setIsFinished(true);
      setError(error.response?.data?.error || "Hiba történt a jegyzet létrehozásakor");
    });
  };

  return { createNote, isLoading, isFinished, error };
};
