import { useState } from 'react';
import { instance as axios } from '../api/axios';

export const useDeleteNote = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const deleteNote = async (noteId) => {
    setIsLoading(true);
    setError(null);
    setIsFinished(false);

    try {
      const response = await axios.delete(`notes/delete/${noteId}`);

      if (response.status === 200) {
        setIsFinished(true);
      } else {
         setError("Sikertelen törlés: Ismeretlen hiba történt.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Hiba történt a jegyzet törlésekor");
    } finally {
      setIsLoading(false);
      setIsFinished(true);
    }
  };

  return { deleteNote, isLoading, isFinished, error };
};