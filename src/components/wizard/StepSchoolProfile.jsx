import React, { useContext, useState, useRef } from 'react';
import { WizardContext } from '../../state/WizardContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../shared/Card';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { School, Upload, Image as ImageIcon, X } from 'lucide-react';

export function StepSchoolProfile() {
  const { state, dispatch } = useContext(WizardContext);
  const [localData, setLocalData] = useState(state.schoolProfile);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'mobile' || name === 'alternateMobile')) {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 10) return;
      setLocalData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    setLocalData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      alert('Please upload a PNG, JPG, or SVG image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalData(prev => ({ ...prev, logoDataUrl: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setLocalData(prev => ({ ...prev, logoDataUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isValid = 
    localData.name.trim() !== '' && 
    localData.address.trim() !== '' && 
    localData.mobile.trim().length === 10 &&
    (localData.alternateMobile === '' || localData.alternateMobile.trim().length === 10);

  const handleNext = () => {
    if (isValid) {
      dispatch({ type: 'SET_SCHOOL_PROFILE', payload: localData });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <School className="w-5 h-5" />
        </div>
        <div>
          <CardTitle>School Profile</CardTitle>
          <p className="text-sm text-ink-600">Enter the school's details as they should appear on the admit card.</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium text-ink-900 mb-2 block">School Logo (Optional)</label>
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-paper-200 flex items-center justify-center bg-paper-50 relative overflow-hidden group">
              {localData.logoDataUrl ? (
                <>
                  <img src={localData.logoDataUrl} alt="Logo preview" className="w-full h-full object-contain p-1" />
                  <div className="absolute inset-0 bg-ink-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={clearImage} className="p-1 bg-white rounded-full text-error hover:bg-paper-100 transition-colors cursor-pointer" aria-label="Clear logo">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <ImageIcon className="w-8 h-8 text-ink-400" />
              )}
            </div>
            <div className="flex-1">
              <input type="file" accept="image/png, image/jpeg, image/svg+xml" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} className="text-sm py-1.5 px-3 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" /> Upload Logo
              </Button>
              <p className="text-xs text-ink-600 mt-2">Max size: 2MB. Format: PNG, JPG, or SVG. This logo will appear in the top-left corner.</p>
            </div>
          </div>
        </div>

        <Input 
          label="School Name *" 
          name="name" 
          value={localData.name} 
          onChange={handleChange} 
          placeholder="e.g. Residential Gurukul School"
          helperText="Supports English and Hindi text."
        />

        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm font-medium text-ink-900">Address *</label>
          <textarea
            name="address"
            value={localData.address}
            onChange={handleChange}
            className="flex min-h-[80px] w-full rounded-lg border border-paper-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            placeholder="e.g. 200m North of High School..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Mobile Number *" 
            name="mobile" 
            value={localData.mobile} 
            onChange={handleChange} 
            placeholder="10 digit mobile number"
            maxLength={10}
          />
          <Input 
            label="Alternate Mobile (Optional)" 
            name="alternateMobile" 
            value={localData.alternateMobile || ''} 
            onChange={handleChange} 
            placeholder="10 digit alternate number"
            maxLength={10}
          />
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button variant="accent" onClick={handleNext} disabled={!isValid} className="cursor-pointer">
          Next Step
        </Button>
      </CardFooter>
    </Card>
  );
}
