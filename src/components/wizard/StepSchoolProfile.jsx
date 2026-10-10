import React, { useContext, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { WizardContext } from "../../state/WizardContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../shared/Card";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { School, Upload, Image as ImageIcon, X, Eye, PenLine } from "lucide-react";
import { AdmitCardTemplate } from "../admit-card/AdmitCardTemplate";
import { DatePicker } from "../shared/DatePicker";

export function StepSchoolProfile() {
  const { state, dispatch } = useContext(WizardContext);
  const [localData, setLocalData] = useState(state.schoolProfile);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const dummyExamDetails = {
    examType: "Half Yearly Examination",
    session: "2026-27",
  };
  const dummyStudent = {
    name: "Student Name",
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    classLabel: "X",
    rollNo: "123",
  };
  const dummySubjects = [
    { date: "10/03/2026", name: "Mathematics" },
    { date: "12/03/2026", name: "Science" },
    { date: "14/03/2026", name: "English" },
    { date: "16/03/2026", name: "Hindi" },
    { date: "18/03/2026", name: "Social Science" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" || name === "alternateMobile") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      setLocalData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type)) {
      alert("Please upload a PNG, JPG, WEBP, or SVG image.");
      return;
    }

    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLocalData((prev) => ({ ...prev, logoDataUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxSide = 256;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objectUrl);
      setLocalData((prev) => ({ ...prev, logoDataUrl: canvas.toDataURL("image/webp", 0.85) }));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLocalData((prev) => ({ ...prev, logoDataUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    };
    img.src = objectUrl;
  };

  const clearImage = () => {
    setLocalData((prev) => ({ ...prev, logoDataUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sigInputRef = useRef(null);

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a PNG, JPG, or WEBP image.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxSide = 300;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objectUrl);
      setLocalData((prev) => ({ ...prev, signatureDataUrl: canvas.toDataURL("image/webp", 0.9) }));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLocalData((prev) => ({ ...prev, signatureDataUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    };
    img.src = objectUrl;
  };

  const clearSignature = () => {
    setLocalData((prev) => ({ ...prev, signatureDataUrl: null }));
    if (sigInputRef.current) sigInputRef.current.value = "";
  };

  const isValid =
    localData.name.trim() !== "" &&
    localData.address.trim() !== "" &&
    localData.mobile.trim().length === 10 &&
    (localData.alternateMobile === "" ||
      localData.alternateMobile.trim().length === 10);

  const handleNext = () => {
    if (isValid) {
      dispatch({ type: "SET_SCHOOL_PROFILE", payload: localData });
      dispatch({ type: "SET_STEP", payload: 2 });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center space-x-3 min-w-0">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <CardTitle>School Profile</CardTitle>
              <p className="text-sm text-ink-600">
                Enter the school's details as they should appear on the admit
                card.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="cursor-pointer shrink-0"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Preview Card</span>
            <span className="sm:hidden">Preview</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-ink-900 mb-2 block">
              School Logo (Optional)
            </label>
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-paper-200 flex items-center justify-center bg-paper-50 relative overflow-hidden group">
                {localData.logoDataUrl ? (
                  <>
                    <img
                      src={localData.logoDataUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-1"
                    />
                    <div className="absolute inset-0 bg-ink-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={clearImage}
                        className="p-1 bg-white rounded-full text-error hover:bg-paper-100 transition-colors cursor-pointer"
                        aria-label="Clear logo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-ink-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm py-1.5 px-3 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload Logo
                </Button>
                <p className="text-xs text-ink-600 mt-2">
                  Max size: 2MB. Format: PNG, JPG, WEBP, or SVG. This logo will appear
                  in the top-left corner.
                </p>
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
            <label className="text-sm font-medium text-ink-900">
              Address *
            </label>
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
              value={localData.alternateMobile || ""}
              onChange={handleChange}
              placeholder="10 digit alternate number"
              maxLength={10}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink-900 mb-2 block">
              Head Signature (Optional)
            </label>
            <div className="flex items-start space-x-4">
              <div className="w-36 h-20 rounded-lg border-2 border-dashed border-paper-200 flex items-center justify-center bg-paper-50 relative overflow-hidden group shrink-0">
                {localData.signatureDataUrl ? (
                  <>
                    <img
                      src={localData.signatureDataUrl}
                      alt="Signature preview"
                      className="w-full h-full object-contain p-1"
                    />
                    <div className="absolute inset-0 bg-ink-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="p-1 bg-white rounded-full text-error hover:bg-paper-100 transition-colors cursor-pointer"
                        aria-label="Clear signature"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <PenLine className="w-8 h-8 text-ink-400" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  ref={sigInputRef}
                  onChange={handleSignatureUpload}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => sigInputRef.current?.click()}
                  className="text-sm py-1.5 px-3 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload Signature
                </Button>
                <p className="text-xs text-ink-600">
                  Transparent PNG works best. Printed above “Head of Gurukul”
                  on every card.
                </p>
                <div className="flex flex-col space-y-2 max-w-xs">
                  <label className="text-sm font-medium text-ink-900">
                    Signature Date (Optional)
                  </label>
                  <DatePicker
                    date={localData.signatureDate ? new Date(localData.signatureDate) : undefined}
                    setDate={(d) =>
                      setLocalData((prev) => ({
                        ...prev,
                        signatureDate: d ? d.toISOString() : null,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button
            variant="accent"
            onClick={handleNext}
            disabled={!isValid}
            className="cursor-pointer"
          >
            Next Step
          </Button>
        </CardFooter>
      </Card>

      {showPreview &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-paper-200 bg-paper-50">
              <h3 className="text-lg font-bold text-ink-900">
                Template Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 rounded-md text-ink-500 hover:text-ink-900 hover:bg-paper-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh] flex justify-center bg-paper-100 hide-scrollbar">
              <div className="transform scale-[0.42] sm:scale-[0.6] md:scale-[0.85] origin-top">
                <div className="shadow-xl bg-white">
                  <AdmitCardTemplate
                    schoolProfile={localData}
                    examDetails={dummyExamDetails}
                    student={dummyStudent}
                    subjects={dummySubjects}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-paper-200 bg-white flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="cursor-pointer"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
