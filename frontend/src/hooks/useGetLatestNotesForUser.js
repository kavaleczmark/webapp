import { useEffect, useState } from "react";
import { instance as axios } from "../api/axios";
import { useAuthContext } from "./useAuthContext";

export const useGetLatestNotesForUser = () => {
  const { user } = useAuthContext();
  const [noteHistory, setNoteHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);

  const fetchNoteHistory = async () => {
    setIsLoading(true);
    setError(null);
    setIsFinished(false);
    try {
      const response = await axios.get(`notes/getNotes`);
      if (response.status === 200) {
        setNoteHistory(response.data);
        setIsFinished(true);
      }
    } catch (err) {
      console.error(err.response || err);
      setError(err.response?.data?.error || "Hiba történt a note history lekérésekor");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNoteHistory();
    } else {
      setNoteHistory([]);
      setIsFinished(false);
    }
  }, [user]);

  return { noteHistory, isLoading, isFinished, error, refreshNoteHistory: fetchNoteHistory };
};
