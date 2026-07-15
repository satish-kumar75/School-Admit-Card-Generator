import React, { useContext, useState } from 'react';
import { WizardContext } from '../../state/WizardContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../shared/Card';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

export function StepClassSelection() {
  const { state, dispatch } = useContext(WizardContext);
  const [localData, setLocalData] = useState(state.classSelection);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const classOptions = [
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

  const handleClassChange = (classKey) => {
    const classLabel = classOptions.find(opt => opt.value === classKey)?.label.replace('Class ', '') || '';
    setLocalData(prev => ({ ...prev, classKey, classLabel }));
  };

  const isValid = localData.classKey !== '' && (!localData.sectionsEnabled || localData.section.trim() !== '');

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
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-ink-900">Class *</label>
          <Select value={localData.classKey} onValueChange={handleClassChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a class..." />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        {localData.sectionsEnabled && (
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
