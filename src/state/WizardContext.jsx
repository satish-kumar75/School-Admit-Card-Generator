import React, { createContext, useReducer, useEffect } from 'react';
import { wizardReducer, initialState } from './wizardReducer';
import { loadDraft, saveDraft } from './localStorageDraft';

export const WizardContext = createContext();

export function WizardProvider({ children }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      dispatch({ type: 'LOAD_DRAFT', payload: draft });
    }
  }, []);

  useEffect(() => {
    // Debounce save draft
    const timeout = setTimeout(() => {
      saveDraft(state);
    }, 500);
    return () => clearTimeout(timeout);
  }, [state.schoolProfile, state.examDetails]);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}
