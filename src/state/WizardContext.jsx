import React, { createContext, useReducer, useEffect } from 'react';
import { wizardReducer, initialState } from './wizardReducer';
import { loadDraft, saveDraft } from './localStorageDraft';
import { downscaleLogo, isOversizedLogo } from '../lib/logo/downscaleLogo';

export const WizardContext = createContext();

export function WizardProvider({ children }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      dispatch({ type: 'LOAD_DRAFT', payload: draft });
      const logo = draft.schoolProfile && draft.schoolProfile.logoDataUrl;
      if (isOversizedLogo(logo)) {
        downscaleLogo(logo)
          .then((small) => {
            if (small && small.length < logo.length) {
              dispatch({ type: 'SET_SCHOOL_PROFILE', payload: { logoDataUrl: small } });
            }
          })
          .catch(() => {});
      }
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
