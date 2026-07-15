import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TimePicker({ value, onChange }) {
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '10', minute: '00', ampm: 'AM' };
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      return {
        hour: match[1].padStart(2, '0'),
        minute: match[2],
        ampm: match[3].toUpperCase()
      };
    }
    return { hour: '10', minute: '00', ampm: 'AM' };
  };

  const { hour, minute, ampm } = parseTime(value);

  const handleChange = (type, val) => {
    let newHour = hour;
    let newMinute = minute;
    let newAmpm = ampm;

    if (type === 'hour') newHour = val;
    if (type === 'minute') newMinute = val;
    if (type === 'ampm') newAmpm = val;

    onChange(`${newHour}:${newMinute} ${newAmpm}`);
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  return (
    <div className="flex items-center space-x-2">
      <Select value={hour} onValueChange={(val) => handleChange('hour', val)}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hours.map(h => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="text-ink-900 font-medium">:</span>
      
      <Select value={minute} onValueChange={(val) => handleChange('minute', val)}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map(m => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={ampm} onValueChange={(val) => handleChange('ampm', val)}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
