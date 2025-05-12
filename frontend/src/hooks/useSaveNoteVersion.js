import { useState } from 'react';
import { instance as axios } from '../api/axios';

export const useSaveNoteVersion = () => {
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const saveNoteVersion = async (notesId, title, text) => {
    setIsSaving(true);
    setError(null);
    setIsFinished(false);

    axios.post("/notes/save", {
      notesId,
      title,
      text
    })
    .then(function (response) {
      if (response.status === 200) {
        setIsSaving(false);
        setIsFinished(true);
        console.log("Verzió mentve:", response.data);
      }
    })
    .catch(function (error) {
      setIsSaving(false);
      setIsFinished(true);
      setError(error.response?.data?.error || "Hiba történt a mentés során");
    });
  };

  return { saveNoteVersion, isSaving, isFinished, error };
};
