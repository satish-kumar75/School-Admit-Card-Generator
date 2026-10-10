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
import { IdCard, ClipboardList, Check } from "lucide-react";
import { cn } from "../../lib/utils";

const modes = [
  {
    key: "admit",
    title: "Admit Card",
    description: "Exam hall tickets, one card per student, 2 per A4 page.",
    Icon: IdCard,
  },
  {
    key: "attendance",
    title: "Attendance Sheet",
    description: "Class rosters with pre-filled names, full A4 page per sheet.",
    Icon: ClipboardList,
  },
];

export function StepModeChoice() {
  const { state, dispatch } = useContext(WizardContext);
  const [selected, setSelected] = useState(state.mode);

  const handleNext = () => {
    if (selected) {
      dispatch({ type: "SET_MODE", payload: selected });
      dispatch({ type: "SET_STEP", payload: 3 });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 1 });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <CardTitle>Choose Format</CardTitle>
          <p className="text-sm text-ink-600">
            What do you want to generate with {state.schoolProfile.name || "this school"}?
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modes.map(({ key, title, description, Icon }) => {
            const isSelected = selected === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={cn(
                  "relative flex flex-col items-start text-left p-5 rounded-xl border-2 transition-all cursor-pointer",
                  isSelected
                    ? "border-primary-500 bg-primary-50 shadow-md"
                    : "border-paper-200 bg-white hover:border-primary-300 hover:bg-paper-50",
                )}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
                <span
                  className={cn(
                    "p-3 rounded-lg mb-3",
                    isSelected
                      ? "bg-primary-500 text-white"
                      : "bg-primary-100 text-primary-600",
                  )}
                >
                  <Icon className="w-6 h-6" />
                </span>
                <span className="text-base font-bold text-ink-900">
                  {title}
                </span>
                <span className="text-sm text-ink-600 mt-1">{description}</span>
              </button>
            );
          })}
        </div>
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
          disabled={!selected}
          className="cursor-pointer"
        >
          Next Step
        </Button>
      </CardFooter>
    </Card>
  );
}
