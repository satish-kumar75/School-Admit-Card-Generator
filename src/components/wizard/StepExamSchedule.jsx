import React, { useContext, useState } from 'react';
import { WizardContext } from '../../state/WizardContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../shared/Card';
import { Button } from '../shared/Button';
import { DatePicker } from '../shared/DatePicker';
import { Calendar, AlertTriangle, Sparkles } from 'lucide-react';
import { startOfToday } from 'date-fns';
import { cn } from '../../lib/utils';

export function StepExamSchedule() {
  const { state, dispatch } = useContext(WizardContext);
  const [localData, setLocalData] = useState(state.subjectSetup);
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const defaultTimes = state.examDetails;

  const isAdvanced = localData.mode === 'advanced';
  const today = startOfToday();

  const updateSubjectDate = (comboId, subjectId, dateObj) => {
    if (!dateObj) return;

    setLocalData(prev => {
      if (!isAdvanced) {
        const targetIdx = prev.subjects.findIndex(s => s.id === subjectId);
        if (targetIdx === -1) return prev;
        
        let currentD = new Date(dateObj);
        const newSubjects = prev.subjects.map((sub, idx) => {
          if (idx < targetIdx) return sub; 
          
          if (!autoFillEnabled && idx > targetIdx) return sub;
          
          if (autoFillEnabled && idx > targetIdx) {
            currentD.setDate(currentD.getDate() + 1);
            if (currentD.getDay() === 0) currentD.setDate(currentD.getDate() + 1); 
          }
          
          return {
            ...sub,
            date: new Date(currentD).toISOString(),
            dayLabel: new Date(currentD).toLocaleDateString('en-US', { weekday: 'short' })
          };
        });
        
        return { ...prev, subjects: newSubjects };
      } else {
        return {
          ...prev,
          combinations: prev.combinations.map(c => {
            if (c.id === comboId) {
              const targetIdx = c.subjects.findIndex(s => s.id === subjectId);
              if (targetIdx === -1) return c;
              
              let currentD = new Date(dateObj);
              const newSubjects = c.subjects.map((sub, idx) => {
                if (idx < targetIdx) return sub;
                
                if (!autoFillEnabled && idx > targetIdx) return sub;
                
                if (autoFillEnabled && idx > targetIdx) {
                  currentD.setDate(currentD.getDate() + 1);
                  if (currentD.getDay() === 0) currentD.setDate(currentD.getDate() + 1);
                }
                
                return {
                  ...sub,
                  date: new Date(currentD).toISOString(),
                  dayLabel: new Date(currentD).toLocaleDateString('en-US', { weekday: 'short' })
                };
              });
              return { ...c, subjects: newSubjects };
            }
            return c;
          })
        };
      }
    });
  };

  const checkValidity = () => {
    if (!isAdvanced) {
      return localData.subjects.every(s => s.date);
    } else {
      return localData.combinations.every(c => c.subjects.every(s => s.date));
    }
  };

  const isValid = checkValidity();

  const handleNext = () => {
    if (isValid) {
      dispatch({ type: 'SET_SUBJECT_SETUP', payload: localData });
      dispatch({ type: 'SET_STEP', payload: 6 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  const hasSunday = !isAdvanced 
    ? localData.subjects.some(s => s.dayLabel === 'Sun')
    : localData.combinations.some(c => c.subjects.some(s => s.dayLabel === 'Sun'));

  const renderSubjectRow = (sub, comboId = null) => {
    const isSunday = sub.dayLabel === 'Sun';
    
    return (
      <div key={sub.id} className={`flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4 md:items-center p-3 md:p-4 border-b border-paper-200 last:border-0 transition-colors ${isSunday ? 'bg-warning/10 hover:bg-warning/20' : 'hover:bg-paper-100/50'}`}>
        <div className="font-medium text-ink-900 flex items-center text-sm md:text-base">
          {sub.name}
        </div>
        <div className="flex items-center space-x-2 w-full">
          <div className="flex-1">
            <DatePicker 
              date={sub.date ? new Date(sub.date) : undefined}
              setDate={(d) => updateSubjectDate(comboId, sub.id, d)}
              disabledDays={(d) => d < today}
            />
          </div>
          {sub.dayLabel && (
            <span className={`text-xs font-bold min-w-[2.5rem] text-right ${isSunday ? 'text-warning-600' : 'text-ink-600'}`}>
              {sub.dayLabel}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <CardTitle>Exam Schedule</CardTitle>
          <p className="text-sm text-ink-600">Set the dates for each subject. Times default to {defaultTimes.defaultTimeStart} - {defaultTimes.defaultTimeEnd} for all subjects.</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-white border border-paper-200 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex items-center justify-between bg-paper-50/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100/50 text-primary-600 rounded-md shadow-sm border border-primary-100">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink-900">Smart Auto-Fill</h4>
                <p className="text-xs text-ink-500 mt-0.5 hidden sm:block">
                  Automatically schedule subsequent dates sequentially
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider hidden sm:block">
                {autoFillEnabled ? 'On' : 'Off'}
              </span>
              <button 
                type="button"
                role="switch"
                aria-checked={autoFillEnabled}
                onClick={() => setAutoFillEnabled(!autoFillEnabled)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                  autoFillEnabled ? 'bg-primary-500' : 'bg-paper-300'
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                  autoFillEnabled ? 'translate-x-5' : 'translate-x-0'
                )} />
              </button>
            </div>
          </div>
          <div className="px-4 py-3 bg-white border-t border-paper-200 sm:hidden">
            <p className="text-xs text-ink-600 leading-relaxed">
              When turned on, picking a date automatically schedules all following subjects sequentially, intelligently skipping any Sundays.
            </p>
          </div>
        </div>

        {hasSunday && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-warning-800">Sunday Selected</h4>
              <p className="text-xs text-warning-700 mt-1">You have scheduled one or more exams on a Sunday. Please verify this is intentional.</p>
            </div>
          </div>
        )}

        {!isAdvanced ? (
          <div className="border border-paper-200 rounded-lg overflow-hidden bg-white">
            <div className="hidden md:grid md:grid-cols-2 gap-4 p-3 bg-paper-100 border-b border-paper-200 text-xs font-semibold text-ink-900 uppercase tracking-wider">
              <div>Subject</div>
              <div>Date</div>
            </div>
            {localData.subjects.map(sub => renderSubjectRow(sub))}
          </div>
        ) : (
          <div className="space-y-8">
            {localData.combinations.map(combo => (
              <div key={combo.id} className="space-y-2">
                <h4 className="font-display font-medium text-ink-900 border-b border-paper-200 pb-2">{combo.name}</h4>
                <div className="border border-paper-200 rounded-lg overflow-hidden bg-white">
                  <div className="hidden md:grid md:grid-cols-2 gap-4 p-3 bg-paper-100 border-b border-paper-200 text-xs font-semibold text-ink-900 uppercase tracking-wider">
                    <div>Subject</div>
                    <div>Date</div>
                  </div>
                  {combo.subjects.map(sub => renderSubjectRow(sub, combo.id))}
                </div>
              </div>
            ))}
          </div>
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
