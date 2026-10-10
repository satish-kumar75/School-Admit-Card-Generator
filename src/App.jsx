import React, { useContext } from 'react';
import { WizardContext } from './state/WizardContext';
import { WizardLayout } from './components/wizard/WizardLayout';
import { StepSchoolProfile } from './components/wizard/StepSchoolProfile';
import { StepModeChoice } from './components/wizard/StepModeChoice';
import { StepExamDetails } from './components/wizard/StepExamDetails';
import { StepClassSelection } from './components/wizard/StepClassSelection';
import { StepSubjectSetup } from './components/wizard/StepSubjectSetup';
import { StepExamSchedule } from './components/wizard/StepExamSchedule';
import { StepStudentUpload } from './components/wizard/StepStudentUpload';
import { StepReviewGenerate } from './components/wizard/StepReviewGenerate';
import { StepAttendanceSettings } from './components/wizard/StepAttendanceSettings';
import { StepAttendanceReview } from './components/wizard/StepAttendanceReview';

function App() {
  const { state } = useContext(WizardContext);

  const renderStep = () => {
    if (state.currentStep === 1) return <StepSchoolProfile />;
    if (state.currentStep === 2) return <StepModeChoice />;

    if (state.mode === 'attendance') {
      switch (state.currentStep) {
        case 3: return <StepClassSelection />;
        case 4: return <StepStudentUpload />;
        case 5: return <StepAttendanceSettings />;
        case 6: return <StepAttendanceReview />;
        default: return <StepClassSelection />;
      }
    }

    switch (state.currentStep) {
      case 3: return <StepExamDetails />;
      case 4: return <StepClassSelection />;
      case 5: return <StepSubjectSetup />;
      case 6: return <StepExamSchedule />;
      case 7: return <StepStudentUpload />;
      case 8: return <StepReviewGenerate />;
      default: return <StepExamDetails />;
    }
  };

  return (
    <WizardLayout>
      {renderStep()}
    </WizardLayout>
  );
}

export default App;
