import { normalizeClass } from './classAliases';

// Helper to find the right key from raw headers
export function findCanonicalKey(row, aliases) {
  for (const [key, value] of Object.entries(row)) {
    const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (aliases.includes(normKey)) {
      return value;
    }
  }
  return undefined;
}

export function validateStudentData(rows, classSelection, subjectSetup) {
  let validCount = 0;
  let warningCount = 0;
  let rejectedCount = 0;
  let skippedCount = 0;
  
  const processedRows = [];
  const rollNoSet = new Set();
  
  const selectedClassesNormalized = classSelection.classes.map(c => normalizeClass(c.classKey));
  const isAdvanced = subjectSetup.mode === 'advanced';
  const validCombos = isAdvanced ? subjectSetup.combinations.map(c => c.name.toLowerCase().trim()) : [];

  for (const rawRow of rows) {
    // Determine mapped fields
    const name = findCanonicalKey(rawRow, ['name', 'studentname', 'fullname']) || '';
    const rollNo = findCanonicalKey(rawRow, ['rollno', 'rollnumber', 'sno']) || '';
    const rawClass = findCanonicalKey(rawRow, ['class', 'grade']) || '';
    const section = findCanonicalKey(rawRow, ['section', 'sec']) || '';
    const combination = findCanonicalKey(rawRow, ['combination', 'stream', 'group']) || '';
    const fatherName = findCanonicalKey(rawRow, ['fathername', 'fathersname']) || '';
    const motherName = findCanonicalKey(rawRow, ['mothername', 'mothersname']) || '';

    // Class skipping check
    const rowClassNormalized = normalizeClass(rawClass);
    if (rowClassNormalized && !selectedClassesNormalized.includes(rowClassNormalized)) {
      skippedCount++;
      continue;
    }

    const student = {
      name: String(name).trim(),
      fatherName: String(fatherName).trim(),
      motherName: String(motherName).trim(),
      rollNo: String(rollNo).trim(),
      classLabel: String(rawClass).trim(),
      section: String(section).trim(),
      combinationName: String(combination).trim(),
      status: 'valid',
      reason: null
    };

    // Validations
    if (!student.name) {
      student.status = 'rejected';
      student.reason = 'Missing name';
    } else if (!student.rollNo) {
      student.status = 'rejected';
      student.reason = 'Missing roll number';
    } else if (!rowClassNormalized) {
      student.status = 'rejected';
      student.reason = 'Unrecognized class value';
    } else if (isAdvanced && (!student.combinationName || !validCombos.includes(student.combinationName.toLowerCase()))) {
      student.status = 'rejected';
      student.reason = `Unrecognized combination — expected one of: ${subjectSetup.combinations.map(c => c.name).join(', ')}`;
    } else if (classSelection.sectionsEnabled && !student.section) {
      student.status = 'rejected';
      student.reason = 'Missing section';
    } else if (classSelection.sectionsEnabled && classSelection.section && student.section.toLowerCase() !== classSelection.section.toLowerCase()) {
      student.status = 'rejected';
      student.reason = `Unrecognized section — expected: ${classSelection.section}`;
    }

    // Warnings
    if (student.status === 'valid') {
      if (/[0-9]/.test(student.name) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/.test(student.name)) {
        student.status = 'warning';
        student.reason = 'Name contains unusual characters';
      }
    }

    // Duplicates
    if (student.status === 'valid' || student.status === 'warning') {
      const uniquenessKey = `${student.classLabel}-${student.rollNo}-${classSelection.sectionsEnabled ? student.section : ''}`;
      if (rollNoSet.has(uniquenessKey)) {
        student.status = 'rejected';
        student.reason = 'Duplicate roll number';
      } else {
        rollNoSet.add(uniquenessKey);
      }
    }

    if (student.status === 'valid') validCount++;
    if (student.status === 'warning') warningCount++;
    if (student.status === 'rejected') rejectedCount++;

    processedRows.push(student);
  }

  return { rows: processedRows, validCount, warningCount, rejectedCount, skippedCount };
}
