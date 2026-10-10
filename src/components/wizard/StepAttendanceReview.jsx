import React, { useContext, useState, useRef, useMemo } from "react";
import { flushSync, createPortal } from "react-dom";
import { format } from "date-fns";
import { WizardContext } from "../../state/WizardContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../shared/Card";
import { Button } from "../shared/Button";
import { CheckCircle2, FileDown, RotateCcw, X, AlertTriangle } from "lucide-react";
import { AttendanceSheetTemplate } from "../admit-card/AttendanceSheetTemplate";
import {
  buildAttendanceSheets,
  sheetClassLabel,
} from "../../lib/attendance/buildSheets";
import {
  prepareCapture,
  createPdf,
  captureElement,
  placeSheetImage,
  waitForPaint,
  decodeImages,
} from "../../lib/pdf/generatePdf";

export function StepAttendanceReview() {
  const { state, dispatch } = useContext(WizardContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isDone, setIsDone] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const hiddenContainerRef = useRef(null);
  const cancelRequestedRef = useRef(false);
  const [renderSheet, setRenderSheet] = useState(0);

  const { schoolProfile, classSelection, studentData, attendance } = state;
  const validStudents = studentData.rows.filter((r) => r.status === "valid");
  const sheets = useMemo(
    () => buildAttendanceSheets(validStudents, classSelection),
    [studentData, classSelection],
  );

  const dateLabel = attendance.date
    ? format(new Date(attendance.date), "dd / MM / yyyy")
    : "";

  const dateParts = attendance.date
    ? {
        day: format(new Date(attendance.date), "dd"),
        month: format(new Date(attendance.date), "MM"),
        year: format(new Date(attendance.date), "yyyy"),
      }
    : { day: "", month: "", year: "" };

  const classNames = classSelection.classes?.length
    ? classSelection.classes.map((c) => c.classLabel).join(", ")
    : "";

  const handleGenerate = async () => {
    if (!sheets.length) return;
    setIsGenerating(true);
    setShowCancelConfirm(false);
    cancelRequestedRef.current = false;
    setProgress({ current: 0, total: sheets.length });

    try {
      const options = await prepareCapture();
      const pdf = createPdf();
      let done = 0;
      let cancelled = false;

      for (let page = 0; page < sheets.length; page++) {
        if (cancelRequestedRef.current) {
          cancelled = true;
          break;
        }
        flushSync(() => {
          setRenderSheet(page);
        });
        await waitForPaint();
        const elements = Array.from(hiddenContainerRef.current.children);
        if (!elements.length) continue;
        await decodeImages(elements);
        if (page > 0) pdf.addPage();

        const dataUrl = await captureElement(elements[0], options);
        placeSheetImage(pdf, dataUrl);
        done++;
        setProgress({ current: done, total: sheets.length });
        if (done < sheets.length) {
          await new Promise((r) => setTimeout(r, 0));
        }
        if (done % 10 === 0 && done < sheets.length) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }

      if (cancelled) {
        setRenderSheet(0);
        setProgress({ current: 0, total: 0 });
        return;
      }

      pdf.save(`Attendance_Class_${classNames.replace(/, /g, "_") || "Sheets"}.pdf`);
      setIsDone(true);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartNew = () => {
    dispatch({ type: "RESET_WIZARD" });
  };

  if (isDone) {
    return (
      <Card className="text-center p-8">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-display font-medium text-ink-900 mb-2">
          Generation Complete!
        </h2>
        <p className="text-ink-600 mb-6">
          Your attendance sheets have been downloaded as a PDF.
        </p>
        <p className="text-sm font-medium text-ink-900 mb-8">
          {sheets.length} sheets · {validStudents.length} students
        </p>
        <Button
          variant="accent"
          onClick={handleStartNew}
          className="cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Start New Batch
        </Button>
      </Card>
    );
  }

  const sampleSheet = sheets[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Review & Generate</CardTitle>
            <p className="text-sm text-ink-600">
              Verify the sample sheet before generating the PDF.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="order-2 md:order-1 flex flex-col items-center">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3 w-full text-center md:text-left">
                Live Preview
              </h4>
              <div
                className="relative w-full flex justify-center bg-paper-50 border border-paper-200 rounded-xl overflow-hidden"
                style={{ minHeight: "420px" }}
              >
                <div className="transform scale-[0.3] sm:scale-[0.35] md:scale-[0.38] origin-top absolute top-4 pb-6">
                  <div className="shadow-2xl bg-white overflow-hidden">
                    {sampleSheet && (
                      <AttendanceSheetTemplate
                        schoolProfile={schoolProfile}
                        classLabel={sheetClassLabel(sampleSheet)}
                        dateParts={dateParts}
                        rows={sampleSheet.rows}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">
                  Generation Summary
                </h4>
                <div className="bg-white border border-paper-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-5 space-y-4 text-sm divide-y divide-paper-100">
                    <div className="flex justify-between items-center pt-2 first:pt-0">
                      <span className="text-ink-500">School Name</span>
                      <span className="font-semibold text-ink-900 text-right max-w-[60%] truncate">
                        {schoolProfile.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-ink-500">Classes</span>
                      <span className="font-semibold text-ink-900 text-right">
                        {classNames || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-ink-500">Sheet Date</span>
                      <span className="font-semibold text-ink-900 text-right">
                        {dateLabel || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-ink-500">Total Students</span>
                      <span className="font-bold text-primary-600 text-right text-lg">
                        {validStudents.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-ink-500">Total Sheets</span>
                      <span className="font-bold text-primary-600 text-right text-lg">
                        {sheets.length}
                      </span>
                    </div>
                  </div>
                  <div className="bg-paper-50 p-5 border-t border-paper-200">
                    {isGenerating ? (
                      <div className="space-y-4 py-2">
                        <div className="w-full bg-paper-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 transition-all duration-200"
                            style={{
                              width: `${(progress.current / progress.total) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-sm font-medium text-primary-900 text-center animate-pulse">
                          Generating... {progress.current} / {progress.total}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelConfirm(true)}
                          className="w-full cursor-pointer flex justify-center items-center text-error border-error/40 hover:bg-error/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel Generation
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="accent"
                        onClick={handleGenerate}
                        disabled={!sheets.length}
                        className="w-full py-4 sm:py-6 text-base font-bold shadow-md cursor-pointer flex justify-center items-center rounded-xl transition-transform active:scale-95"
                      >
                        <FileDown className="w-5 h-5 mr-2" />
                        Generate PDF ({sheets.length} sheets)
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        {!isGenerating && (
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}
              className="cursor-pointer"
            >
              Back
            </Button>
          </CardFooter>
        )}
      </Card>

      <div
        ref={hiddenContainerRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          zIndex: -9999,
        }}
      >
        {sheets[renderSheet] && (
          <AttendanceSheetTemplate
            schoolProfile={schoolProfile}
            classLabel={sheetClassLabel(sheets[renderSheet])}
            dateParts={dateParts}
            rows={sheets[renderSheet].rows}
          />
        )}
      </div>

      {showCancelConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-2">
                  Cancel generation?
                </h3>
                <p className="text-sm text-ink-600 mb-6">
                  {progress.current} of {progress.total} sheets done. This
                  progress will be discarded and no PDF will be downloaded.
                </p>
                <div className="flex w-full gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Keep Going
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      cancelRequestedRef.current = true;
                      setShowCancelConfirm(false);
                    }}
                    className="flex-1 cursor-pointer bg-error hover:bg-error/90 focus:ring-error"
                  >
                    Yes, Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
