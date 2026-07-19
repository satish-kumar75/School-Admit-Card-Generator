import React, { useContext, useState } from 'react';
import { WizardContext } from '../../state/WizardContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../shared/Card';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { Users, Check } from 'lucide-react';

export function StepClassSelection() {
  const { state, dispatch } = useContext(WizardContext);
  
  const initialClasses = state.classSelection.classes || 
    (state.classSelection.classKey 
      ? [{ classKey: state.classSelection.classKey, classLabel: state.classSelection.classLabel }] 
      : []);

  const [localData, setLocalData] = useState({
    ...state.classSelection,
    classes: initialClasses
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const classOptions = [
    { label: "PG-1", value: "pg-1" },
    { label: "PG-2", value: "pg-2" },
    { label: "Nursery", value: "nursery" },
    { label: "LKG", value: "lkg" },
    { label: "UKG", value: "ukg" },
    { label: "Class I", value: "1" },
    { label: "Class II", value: "2" },
    { label: "Class III", value: "3" },
    { label: "Class IV", value: "4" },
    { label: "Class V", value: "5" },
    { label: "Class VI", value: "6" },
    { label: "Class VII", value: "7" },
    { label: "Class VIII", value: "8" },
    { label: "Class IX", value: "9" },
    { label: "Class X", value: "10" },
    { label: "Class XI", value: "11" },
    { label: "Class XII", value: "12" }
  ];

  const handleToggleClass = (opt) => {
    setLocalData(prev => {
      const isSelected = prev.classes.some(c => c.classKey === opt.value);
      let newClasses;
      if (isSelected) {
        newClasses = prev.classes.filter(c => c.classKey !== opt.value);
      } else {
        newClasses = [...prev.classes, { classKey: opt.value, classLabel: opt.label.replace('Class ', '') }];
      }
      
      const isMultiple = newClasses.length > 1;
      
      return {
        ...prev,
        classes: newClasses,
        sectionsEnabled: isMultiple ? false : prev.sectionsEnabled,
        section: isMultiple ? '' : prev.section,
      };
    });
  };

  const isMultiple = localData.classes.length > 1;
  const isValid = !localData.sectionsEnabled || localData.section.trim() !== '';

  const handleNext = () => {
    if (isValid) {
      dispatch({ type: 'SET_CLASS_SELECTION', payload: localData });
      dispatch({ type: 'SET_STEP', payload: 4 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <CardTitle>Class Selection</CardTitle>
          <p className="text-sm text-ink-600">Select the class for this batch of admit cards.</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-medium text-ink-900">Select Classes *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {classOptions.map(opt => {
              const isSelected = localData.classes.some(c => c.classKey === opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleToggleClass(opt)}
                  className={`flex items-center justify-between px-3 py-2 border rounded-md transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-sm' 
                      : 'bg-white border-paper-200 text-ink-700 hover:bg-paper-50'
                  }`}
                >
                  <span className="text-sm font-medium">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-ink-500 mt-1 italic">
            Tip: You can skip selecting any class if you only want to generate completely blank templates.
          </p>
        </div>

        {!isMultiple && (
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="sectionsEnabled" 
              name="sectionsEnabled"
              checked={localData.sectionsEnabled}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded border-paper-200 focus:ring-primary-500 cursor-pointer"
            />
            <label htmlFor="sectionsEnabled" className="text-sm text-ink-900 cursor-pointer">
              This class is divided into sections (e.g. A, B, C)
            </label>
          </div>
        )}

        {localData.sectionsEnabled && !isMultiple && (
          <Input 
            label="Section *" 
            name="section" 
            value={localData.section} 
            onChange={handleChange} 
            placeholder="e.g. A" 
            helperText="Roll numbers will be validated for uniqueness within this specific section."
          />
        )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" onClick={handleBack} className="cursor-pointer">
          Back
        </Button>
        <Button variant="accent" onClick={handleNext} disabled={!isValid} className="cursor-pointer">
          Next Step
        </Button>
      </CardFooter>
    </Card>
  );
}
