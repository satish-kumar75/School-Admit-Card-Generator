import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (ext === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  } else if (ext === 'xlsx' || ext === 'xls') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  } else {
    throw new Error('Unsupported file type');
  }
}

export function generateSampleTemplate(isAdvanced) {
  const headers = ['Name', 'Class', 'Roll No'];
  if (isAdvanced) {
    headers.push('Combination');
  }
  
  const sampleRows = [
    ['Aarav Kumar', 'V', '018'],
    ['Ananya Singh', 'V', '023']
  ];
  
  if (isAdvanced) {
    sampleRows[0].push('Science');
    sampleRows[1].push('Commerce');
  }

  const allData = [headers, ...sampleRows];
  const csv = allData.map(row => row.join(',')).join('\n');
  
  return { csv, rawData: allData };
}
