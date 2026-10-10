import React, { useContext, useState } from "react";
import { WizardContext } from "../../state/WizardContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../shared/Card";
import { Button } from "../shared/Button";
import { DatePicker } from "../shared/DatePicker";
import { CalendarDays } from "lucide-react";

export function StepAttendanceSettings() {
  const { state, dispatch } = useContext(WizardContext);
  const [localDate, setLocalDate] = useState(
    state.attendance.date ? new Date(state.attendance.date) : undefined,
  );

  const handleNext = () => {
    dispatch({
      type: "SET_ATTENDANCE",
      payload: { date: localDate ? localDate.toISOString() : null },
    });
    dispatch({ type: "SET_STEP", payload: 6 });
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 4 });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <CardTitle>Attendance Date</CardTitle>
          <p className="text-sm text-ink-600">
            This date will be printed on every attendance sheet.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2 max-w-sm">
          <label className="text-sm font-medium text-ink-900">
            Sheet Date (Optional)
          </label>
          <DatePicker date={localDate} setDate={setLocalDate} />
        </div>
        <p className="text-xs text-ink-600">
          Leave it empty to fill the date by hand on the printed sheet.
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
          className="cursor-pointer"
        >
          Next Step
        </Button>
      </CardFooter>
    </Card>
  );
}
