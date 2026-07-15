import React, { useContext } from 'react';
import { WizardContext } from './state/WizardContext';
import { WizardLayout } from './components/wizard/WizardLayout';
import { StepSchoolProfile } from './components/wizard/StepSchoolProfile';
import { StepExamDetails } from './components/wizard/StepExamDetails';
import { StepClassSelection } from './components/wizard/StepClassSelection';
import { StepSubjectSetup } from './components/wizard/StepSubjectSetup';
import { StepExamSchedule } from './components/wizard/StepExamSchedule';
import { StepStudentUpload } from './components/wizard/StepStudentUpload';
import { StepReviewGenerate } from './components/wizard/StepReviewGenerate';

function App() {
  const { state } = useContext(WizardContext);

  const renderStep = () => {
    switch (state.currentStep) {
      case 1: return <StepSchoolProfile />;
      case 2: return <StepExamDetails />;
      case 3: return <StepClassSelection />;
      case 4: return <StepSubjectSetup />;
      case 5: return <StepExamSchedule />;
      case 6: return <StepStudentUpload />;
      case 7: return <StepReviewGenerate />;
      default: return <StepSchoolProfile />;
    }
  };

  return (
    <WizardLayout>
      {renderStep()}
    </WizardLayout>
  );
}

export default App;
