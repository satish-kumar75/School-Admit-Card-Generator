export const initialState = {
  currentStep: 1,
  schoolProfile: {
    logoDataUrl: null,
    name: '',
    address: '',
    mobile: '',
    alternateMobile: '',
  },
  examDetails: {
    examType: 'annual',
    customLabel: '',
    session: '',
    defaultTimeStart: '09:00 AM',
    defaultTimeEnd: '01:00 PM',
  },
  classSelection: {
    classes: [], 
    sectionsEnabled: false,
    section: '',
  },
  subjectSetup: {
    mode: 'simple',
    subjects: [], 
    combinations: [], 
  },
  studentData: {
    rows: [],
    validCount: 0,
    warningCount: 0,
    rejectedCount: 0,
    skippedCount: 0,
  }
};

export function wizardReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SCHOOL_PROFILE':
      return { ...state, schoolProfile: { ...state.schoolProfile, ...action.payload } };
    case 'SET_EXAM_DETAILS':
      return { ...state, examDetails: { ...state.examDetails, ...action.payload } };
    case 'SET_CLASS_SELECTION':
      return { ...state, classSelection: { ...state.classSelection, ...action.payload } };
    case 'SET_SUBJECT_SETUP':
      // If subjects change, invalidate student data if needed, but per spec student data revalidation
      // might be complex. Usually we just let the user know preview needs regeneration.
      return { ...state, subjectSetup: { ...state.subjectSetup, ...action.payload } };
    case 'SET_STUDENT_DATA':
      return { ...state, studentData: action.payload };
    case 'RESET_WIZARD':
      return {
        ...initialState,
        schoolProfile: state.schoolProfile, // preserve school profile
        examDetails: state.examDetails, // optionally preserve exam details
      };
    case 'LOAD_DRAFT':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
