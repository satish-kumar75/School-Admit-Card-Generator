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
import { BookOpen, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

const COMMON_SUBJECTS = [
  "Hindi",
  "English",
  "Mathematics",
  "Science",
  "Social Science",
  "Sanskrit",
  "General Knowledge",
  "Computer Science",
  "Hindi Grammar",
  "English Grammar",
  "Hindi + Hindi Grammar",
  "English + English Grammar",
  "Drawing",
];

export function StepSubjectSetup() {
  const { state, dispatch } = useContext(WizardContext);
  const [localData, setLocalData] = useState(state.subjectSetup);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newCombinationName, setNewCombinationName] = useState("");

  const isAdvanced = localData.mode === "advanced";

  const toggleMode = () => {
    if (isAdvanced) {
      if (
        confirm(
          "Switching to Simple Mode will discard your combinations. Continue?",
        )
      ) {
        setLocalData((prev) => ({ ...prev, mode: "simple", combinations: [] }));
      }
    } else {
      setLocalData((prev) => ({ ...prev, mode: "advanced", subjects: [] }));
    }
  };

  const handleAddSubject = (name, targetComboId = null) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (isAdvanced && targetComboId) {
      setLocalData((prev) => ({
        ...prev,
        combinations: prev.combinations.map((c) => {
          if (c.id === targetComboId) {
            if (
              c.subjects.find(
                (s) => s.name.toLowerCase() === trimmedName.toLowerCase(),
              )
            )
              return c;
            return {
              ...c,
              subjects: [
                ...c.subjects,
                {
                  id: Date.now().toString(),
                  name: trimmedName,
                  date: null,
                  dayLabel: null,
                  timeStart: null,
                  timeEnd: null,
                },
              ],
            };
          }
          return c;
        }),
      }));
    } else {
      if (
        localData.subjects.find(
          (s) => s.name.toLowerCase() === trimmedName.toLowerCase(),
        )
      ) {
        setNewSubjectName("");
        return;
      }
      setLocalData((prev) => ({
        ...prev,
        subjects: [
          ...prev.subjects,
          {
            id: Date.now().toString(),
            name: trimmedName,
            date: null,
            dayLabel: null,
            timeStart: null,
            timeEnd: null,
          },
        ],
      }));
      setNewSubjectName("");
    }
  };

  const handleLoadPattern = () => {
    const pattern = [
      "Hindi + Hindi Grammar",
      "English + English Grammar",
      "Computer Science",
      "Mathematics",
      "Science",
      "Social Science",
      "General Knowledge",
      "Drawing",
    ];

    setLocalData((prev) => {
      const newSubjects = [...prev.subjects];
      pattern.forEach((subjectName, index) => {
        if (
          !newSubjects.find(
            (s) => s.name.toLowerCase() === subjectName.toLowerCase(),
          )
        ) {
          newSubjects.push({
            id: Date.now().toString() + index,
            name: subjectName,
            date: null,
            dayLabel: null,
            timeStart: null,
            timeEnd: null,
          });
        }
      });
      return { ...prev, subjects: newSubjects };
    });
  };

  const removeSimpleSubject = (id) => {
    setLocalData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
  };

  const moveSimpleSubject = (index, direction) => {
    setLocalData((prev) => {
      const newSubjects = [...prev.subjects];
      if (direction === -1 && index > 0) {
        [newSubjects[index - 1], newSubjects[index]] = [
          newSubjects[index],
          newSubjects[index - 1],
        ];
      } else if (direction === 1 && index < newSubjects.length - 1) {
        [newSubjects[index + 1], newSubjects[index]] = [
          newSubjects[index],
          newSubjects[index + 1],
        ];
      }
      return { ...prev, subjects: newSubjects };
    });
  };

  const addCombination = () => {
    const name = newCombinationName.trim();
    if (!name) return;
    if (
      localData.combinations.find(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setNewCombinationName("");
      return;
    }
    setLocalData((prev) => ({
      ...prev,
      combinations: [
        ...prev.combinations,
        { id: Date.now().toString(), name, subjects: [] },
      ],
    }));
    setNewCombinationName("");
  };

  const removeCombination = (id) => {
    setLocalData((prev) => ({
      ...prev,
      combinations: prev.combinations.filter((c) => c.id !== id),
    }));
  };

  const removeCombinationSubject = (comboId, subjectId) => {
    setLocalData((prev) => ({
      ...prev,
      combinations: prev.combinations.map((c) => {
        if (c.id === comboId) {
          return {
            ...c,
            subjects: c.subjects.filter((s) => s.id !== subjectId),
          };
        }
        return c;
      }),
    }));
  };

  const isValid = isAdvanced
    ? localData.combinations.length >= 2 &&
      localData.combinations.every((c) => c.subjects.length > 0)
    : localData.subjects.length > 0;

  const handleNext = () => {
    if (isValid) {
      dispatch({ type: "SET_SUBJECT_SETUP", payload: localData });
      dispatch({ type: "SET_STEP", payload: 6 });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 4 });
  };

  const renderSubjectList = (subjects, onRemove, onMove) => (
    <ul className="space-y-2 mt-4 overflow-hidden">
      <AnimatePresence initial={false}>
        {subjects.map((sub, idx) => (
          <motion.li
            key={sub.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 bg-white border border-paper-200 rounded-lg overflow-hidden"
          >
            <span className="font-medium text-ink-900">{sub.name}</span>
            <div className="flex items-center space-x-1">
              {onMove && (
                <>
                  <button
                    onClick={() => onMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-ink-400 hover:text-ink-900 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMove(idx, 1)}
                    disabled={idx === subjects.length - 1}
                    className="p-1 text-ink-400 hover:text-ink-900 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => onRemove(sub.id)}
                className="p-1 text-error hover:bg-error/10 rounded ml-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
      {subjects.length === 0 && (
        <li className="p-4 text-center text-sm text-ink-600 border border-dashed border-paper-200 rounded-lg bg-paper-50/50">
          No subjects added yet.
        </li>
      )}
    </ul>
  );

  const renderSubjectChips = (targetComboId = null) => {
    let currentSubjects = [];
    if (isAdvanced && targetComboId) {
      const combo = localData.combinations.find((c) => c.id === targetComboId);
      if (combo) currentSubjects = combo.subjects;
    } else {
      currentSubjects = localData.subjects;
    }

    return (
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
          Common Subjects
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_SUBJECTS.map((subject) => {
            const isSelected = currentSubjects.some(
              (s) => s.name.toLowerCase() === subject.toLowerCase(),
            );

            return (
              <motion.button
                key={subject}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddSubject(subject, targetComboId)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium border rounded-full transition-colors cursor-pointer flex items-center",
                  isSelected
                    ? "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 shadow-sm"
                    : "bg-paper-100 text-ink-700 hover:bg-primary-100 hover:text-primary-700 border-paper-200",
                )}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                <span>{subject}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex flex-row items-center space-x-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Subject Setup</CardTitle>
            <p className="text-sm text-ink-600">
              Add the subjects for this class's exam.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-ink-900">
            Advanced Mode
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAdvanced}
            onClick={toggleMode}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              isAdvanced ? "bg-primary-500" : "bg-paper-200",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                isAdvanced ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isAdvanced ? (
          <div>
            {renderSubjectChips()}
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2 mt-4">
              Or Add Custom Subject
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                placeholder="e.g. Environmental Studies"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddSubject(newSubjectName)
                }
              />
              <Button
                type="button"
                onClick={() => handleAddSubject(newSubjectName)}
                variant="secondary"
                className="cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
              <Button
                type="button"
                onClick={handleLoadPattern}
                variant="outline"
                className="cursor-pointer whitespace-nowrap"
              >
                Load Preset Pattern
              </Button>
            </div>
            {renderSubjectList(
              localData.subjects,
              removeSimpleSubject,
              moveSimpleSubject,
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-info/10 border border-info/20 rounded-lg text-sm text-ink-900">
              <strong>Advanced Mode:</strong> Define subject combinations. Your
              uploaded student list will need a <code>Combination</code> column
              matching these names exactly.
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="New combination name (e.g. Science Stream)"
                value={newCombinationName}
                onChange={(e) => setNewCombinationName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCombination()}
              />
              <Button
                type="button"
                onClick={addCombination}
                variant="secondary"
                className="cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Group
              </Button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {localData.combinations.map((combo) => (
                  <motion.div
                    key={combo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 border border-paper-200 rounded-lg bg-paper-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-display font-medium text-ink-900">
                        {combo.name}
                      </h4>
                      <Button
                        variant="ghost"
                        onClick={() => removeCombination(combo.id)}
                        className="h-8 px-2 text-error hover:text-error hover:bg-error/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    </div>
                    {renderSubjectChips(combo.id)}
                    <SubjectInput
                      onAdd={(name) => handleAddSubject(name, combo.id)}
                    />
                    {renderSubjectList(
                      combo.subjects,
                      (subId) => removeCombinationSubject(combo.id, subId),
                      null,
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
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

function SubjectInput({ onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex space-x-2 mt-4">
      <Input
        placeholder="Add custom subject..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAdd(val);
            setVal("");
          }
        }}
      />
      <Button
        type="button"
        onClick={() => {
          onAdd(val);
          setVal("");
        }}
        variant="secondary"
        className="cursor-pointer"
      >
        Add
      </Button>
    </div>
  );
}
