import React, { useContext, useState, useRef } from 'react';
import { WizardContext } from '../../state/WizardContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../shared/Card';
import { Button } from '../shared/Button';
import { Upload, FileText, CheckCircle2, AlertTriangle, XCircle, Download, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { parseFile, generateSampleTemplate } from '../../lib/parsing/parseFile';
import { validateStudentData } from '../../lib/validation/studentRowValidator';
import { cn } from '../../lib/utils';
import * as XLSX from 'xlsx';

export function StepStudentUpload() {
  const { state, dispatch } = useContext(WizardContext);
  const [localData, setLocalData] = useState(state.studentData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const isAdvanced = state.subjectSetup.mode === 'advanced';

  const downloadTemplateCsv = () => {
    const { csv } = generateSampleTemplate(isAdvanced);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "admit_card_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTemplateExcel = () => {
    const { rawData } = generateSampleTemplate(isAdvanced);
    const worksheet = XLSX.utils.aoa_to_sheet(rawData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "admit_card_template.xlsx");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setErrorMsg('Please upload a .csv or .xlsx file.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const rawRows = await parseFile(file);
      if (rawRows.length === 0) {
        setErrorMsg('This file has no student rows.');
        setIsProcessing(false);
        return;
      }

      const firstRowKeys = Object.keys(rawRows[0]).join(',').toLowerCase();
      if (!firstRowKeys.includes('name') || !firstRowKeys.includes('roll')) {
        setErrorMsg('This doesn\'t look like the expected format. Please use the sample template.');
        setIsProcessing(false);
        return;
      }

      const validationResult = validateStudentData(rawRows, state.classSelection, state.subjectSetup);
      
      if (validationResult.validCount === 0 && validationResult.rejectedCount === 0 && validationResult.skippedCount > 0) {
        setErrorMsg(`No rows matched Class ${state.classSelection.classLabel} in this file. Did you select the right class, or upload the right file?`);
        setLocalData({ rows: [], validCount: 0, warningCount: 0, rejectedCount: 0, skippedCount: 0 });
        setIsProcessing(false);
        return;
      }

      setLocalData(validationResult);
      setCurrentPage(1);
      
    } catch (err) {
      setErrorMsg('Error parsing file: ' + err.message);
    }
    
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isValid = localData.validCount > 0;

  const handleNext = () => {
    if (isValid) {
      dispatch({ type: 'SET_STUDENT_DATA', payload: localData });
      dispatch({ type: 'SET_STEP', payload: 7 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'valid': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-error" />;
      default: return null;
    }
  };

  const totalPages = Math.ceil(localData.rows.length / rowsPerPage);
  const displayedRows = localData.rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <CardTitle>Student Data Upload</CardTitle>
          <p className="text-sm text-ink-600">Upload the student list for Class {state.classSelection.classLabel}.</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {localData.rows.length === 0 ? (
          <div className="space-y-6">
            <div className="bg-paper-100/50 border border-paper-200 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center">
              <FileText className="w-10 h-10 text-ink-400 mb-3" />
              <h4 className="text-sm font-medium text-ink-900 mb-1">Upload CSV or Excel</h4>
              <p className="text-xs text-ink-600 mb-5 max-w-sm">Use the exact header format for seamless import. Download our sample template if you are unsure.</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" onClick={downloadTemplateExcel} className="cursor-pointer flex-1 sm:flex-none justify-center px-3">
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-success" /> Excel
                  </Button>
                  <Button variant="outline" onClick={downloadTemplateCsv} className="cursor-pointer flex-1 sm:flex-none justify-center px-3">
                    <FileText className="w-4 h-4 mr-2 text-info" /> CSV
                  </Button>
                </div>
                
                <input type="file" accept=".csv, .xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <Button onClick={() => fileInputRef.current?.click()} isLoading={isProcessing} className="cursor-pointer w-full sm:w-auto justify-center">
                  <Upload className="w-4 h-4 mr-2" /> Select File
                </Button>
              </div>
              
              {errorMsg && (
                <div className="mt-4 p-3 bg-error/10 text-error text-sm rounded-lg flex items-start w-full sm:w-auto text-left">
                  <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-ink-600 space-y-1">
              <p><strong>Required columns:</strong> Name, Class, Roll No{state.classSelection.sectionsEnabled ? ', Section' : ''}{isAdvanced ? ', Combination' : ''}</p>
              <p><strong>Note:</strong> Ensure Roll Numbers with leading zeros (e.g. "023") are formatted as Text in Excel before saving, to prevent the zeros from being lost.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-paper-50 border border-paper-200 rounded-lg gap-4">
              <div>
                <h4 className="font-medium text-ink-900">Validation Complete</h4>
                <p className="text-sm text-ink-600 mt-1">
                  {localData.validCount} valid · {localData.warningCount} warnings · {localData.rejectedCount} rejected
                  {localData.skippedCount > 0 && ` (${localData.skippedCount} skipped from other classes)`}
                </p>
              </div>
              <div className="flex space-x-2 shrink-0 w-full sm:w-auto">
                <input type="file" accept=".csv, .xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} isLoading={isProcessing} className="cursor-pointer w-full sm:w-auto justify-center">
                  Re-upload
                </Button>
              </div>
            </div>

            <div className="border border-paper-200 rounded-lg overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-paper-100 text-ink-900 uppercase text-[10px] sm:text-xs">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">Status</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">Roll No</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">Name</th>
                    {isAdvanced && <th className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">Combination</th>}
                    <th className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-200 bg-white">
                  {displayedRows.map((row, idx) => (
                    <tr key={idx} className={cn("transition-colors", row.status === 'rejected' ? 'bg-error/5 opacity-75' : row.status === 'warning' ? 'bg-warning/5' : 'hover:bg-paper-50')}>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 flex items-center">{getStatusIcon(row.status)}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-ink-900 whitespace-nowrap">{row.rollNo}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{row.name}</td>
                      {isAdvanced && <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{row.combinationName}</td>}
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-[10px] sm:text-xs">
                        <span className={cn(
                          row.status === 'rejected' ? 'text-error' : row.status === 'warning' ? 'text-warning' : 'text-success'
                        )}>
                          {row.reason || 'Valid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="p-3 flex items-center justify-between bg-paper-50 border-t border-paper-200">
                  <span className="text-xs text-ink-600">
                    Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, localData.rows.length)} of {localData.rows.length} entries
                  </span>
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2 py-1 h-auto cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center px-3 text-xs font-medium text-ink-900 bg-white border border-paper-200 rounded">
                      {currentPage} / {totalPages}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 h-auto cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
