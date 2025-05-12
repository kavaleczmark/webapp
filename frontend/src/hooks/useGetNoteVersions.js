import { useState, useEffect, useCallback } from 'react';
import { instance as axios } from '../api/axios';

export const useGetNoteVersions = (noteId) => {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);

  const getVersions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsFinished(false);

    try {
      const response = await axios.get(`/notes/versions/${noteId}`);
      if (response.status === 200) {
        setVersions(response.data);
        setIsFinished(true);
        setIsLoading(false);
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.error || "Hiba a verziók lekérésekor");
      setIsLoading(false);
    }
  }, [noteId]); 

  useEffect(() => {
    if (noteId) {
      getVersions();
    } else {
      setVersions([]);
      setIsFinished(false);
    }
  }, [noteId, getVersions]);

  return { versions, isLoading, isFinished, error, getVersions };
};
