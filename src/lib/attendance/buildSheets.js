export const ATTENDANCE_ROWS_PER_SHEET = 24;

export function buildAttendanceSheets(validStudents, classSelection) {
  const orderedClasses =
    classSelection.classes && classSelection.classes.length
      ? classSelection.classes.map((c) => c.classLabel)
      : [];

  const groups = new Map();
  for (const s of validStudents) {
    const key = s.classLabel || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }

  const sortedKeys = [...groups.keys()].sort((a, b) => {
    const ia = orderedClasses.indexOf(a);
    const ib = orderedClasses.indexOf(b);
    if (ia === -1 && ib === -1) return String(a).localeCompare(String(b));
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const sheets = [];
  for (const key of sortedKeys) {
    const students = [...groups.get(key)].sort((a, b) => {
      const ra = parseFloat(a.rollNo);
      const rb = parseFloat(b.rollNo);
      if (!Number.isNaN(ra) && !Number.isNaN(rb)) return ra - rb;
      return String(a.rollNo).localeCompare(String(b.rollNo));
    });

    const totalPages = Math.max(
      1,
      Math.ceil(students.length / ATTENDANCE_ROWS_PER_SHEET),
    );
    for (let page = 0; page < totalPages; page++) {
      const slice = students.slice(
        page * ATTENDANCE_ROWS_PER_SHEET,
        page * ATTENDANCE_ROWS_PER_SHEET + ATTENDANCE_ROWS_PER_SHEET,
      );
      const rows = slice.map((s, i) => ({
        sno: page * ATTENDANCE_ROWS_PER_SHEET + i + 1,
        name: s.name,
        fatherName: s.fatherName,
        motherName: s.motherName,
      }));
      while (rows.length < ATTENDANCE_ROWS_PER_SHEET) {
        rows.push({
          sno: page * ATTENDANCE_ROWS_PER_SHEET + rows.length + 1,
          name: "",
          fatherName: "",
          motherName: "",
        });
      }
      sheets.push({
        classLabel: key,
        section: (students[0] && students[0].section) || "",
        rows,
      });
    }
  }
  return sheets;
}

export function sheetClassLabel(sheet) {
  if (!sheet.classLabel) return "";
  return sheet.section
    ? `${sheet.classLabel} - Sec ${sheet.section}`
    : sheet.classLabel;
}
