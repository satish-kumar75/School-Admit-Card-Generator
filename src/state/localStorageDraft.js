export function saveDraft(state) {
  try {
    // Only save profile and details to prevent huge localStorage (e.g. from student data)
    const draft = {
      schoolProfile: state.schoolProfile,
      examDetails: state.examDetails,
    };
    localStorage.setItem('admitCardWizardDraft', JSON.stringify(draft));
  } catch (e) {
    console.warn('Draft couldn\'t be saved locally', e);
  }
}

export function loadDraft() {
  try {
    const draft = localStorage.getItem('admitCardWizardDraft');
    if (draft) {
      return JSON.parse(draft);
    }
  } catch (e) {
    console.warn('Could not load draft', e);
  }
  return null;
}
