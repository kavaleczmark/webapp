import { useEffect, useState } from 'react';
import { instance as axios } from '../api/axios';

export const useGetNoteVersions = (noteId) => {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);

  const getVersions = async () => {
    if (!noteId) {
      setVersions([]);
      setIsFinished(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsFinished(false);

    try {
      const response = await axios.get(`/notes/versions/${noteId}`);
      if (response.status === 200) {
        setVersions(response.data);
        setIsFinished(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Hiba a verziók lekérésekor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVersions();
  }, [noteId]);

  return { versions, isLoading, isFinished, error, getVersions }; 
};
