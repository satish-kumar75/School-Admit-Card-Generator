import React, { useContext, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "../shared/TimePicker";
import { FileText } from "lucide-react";

export function StepExamDetails() {
  const { state, dispatch } = useContext(WizardContext);
  const [localData, setLocalData] = useState(state.examDetails);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const isCustom = localData.examType === "custom";
  const isValid =
    localData.session.trim() !== "" &&
    localData.defaultTimeStart.trim() !== "" &&
    localData.defaultTimeEnd.trim() !== "" &&
    (!isCustom || localData.customLabel.trim() !== "");

  const handleNext = () => {
    if (isValid) {
      dispatch({ type: "SET_EXAM_DETAILS", payload: localData });
      dispatch({ type: "SET_STEP", payload: 4 });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 2 });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <CardTitle>Exam Details</CardTitle>
          <p className="text-sm text-ink-600">
            Configure the exam type, academic session, and default timing.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-ink-900">
            Exam Type *
          </label>
          <Select
            value={localData.examType}
            onValueChange={(val) => handleSelectChange("examType", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Exam Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual Examination</SelectItem>
              <SelectItem value="half-yearly">
                Half-Yearly Examination
              </SelectItem>
              <SelectItem value="quarterly">Quarterly Examination</SelectItem>
              <SelectItem value="unit-test">Unit Test</SelectItem>
              <SelectItem value="pre-board">Pre-Board Examination</SelectItem>
              <SelectItem value="custom">Custom...</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isCustom && (
          <Input
            label="Custom Exam Label *"
            name="customLabel"
            value={localData.customLabel}
            onChange={handleChange}
            placeholder="e.g. Mid-Term Assessment"
          />
        )}

        <Input
          label="Academic Session *"
          name="session"
          value={localData.session}
          onChange={handleChange}
          placeholder="e.g. 2026-27"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-ink-900">
              Default Start Time *
            </label>
            <TimePicker
              value={localData.defaultTimeStart}
              onChange={(val) => handleSelectChange("defaultTimeStart", val)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-ink-900">
              Default End Time *
            </label>
            <TimePicker
              value={localData.defaultTimeEnd}
              onChange={(val) => handleSelectChange("defaultTimeEnd", val)}
            />
          </div>
        </div>
        <p className="text-xs text-ink-600 mt-2">
          This time range will be applied to all subjects by default. You can
          override it later.
        </p>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          onClick={handleBack}
          className="cursor-pointer"
        >
          Back
        </Button>
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
  );
}
