"use client";

import { useState } from "react";
import { GraduationCap, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";

const gradePoints: Record<string, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0,
};

interface Course {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

let nextId = 1;
const emptyCourse = (): Course => ({ id: nextId++, name: "", credits: "3", grade: "" });

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([emptyCourse()]);
  const [result, setResult] = useState<{ gpa: number; credits: number; points: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (id: number, patch: Partial<Course>) => {
    setCourses((current) =>
      current.map((course) => (course.id === id ? { ...course, ...patch } : course)),
    );
  };

  const calculate = () => {
    setError(null);
    setResult(null);

    let totalCredits = 0;
    let totalPoints = 0;

    for (const course of courses) {
      const credits = Number(course.credits);
      if (!Number.isFinite(credits) || credits <= 0) {
        setError(`"${course.name || `Course ${course.id}`}" needs a credit value greater than zero.`);
        return;
      }
      if (!course.grade) {
        setError(`Choose a grade for "${course.name || `Course ${course.id}`}".`);
        return;
      }
      totalCredits += credits;
      totalPoints += credits * gradePoints[course.grade];
    }

    if (totalCredits === 0) {
      setError("Add at least one course before calculating.");
      return;
    }

    setResult({
      gpa: totalPoints / totalCredits,
      credits: totalCredits,
      points: totalPoints,
    });
  };

  const reset = () => {
    setCourses([emptyCourse()]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="grid gap-3 rounded-card border border-border bg-surface p-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
          >
            <Field label={`Course ${index + 1}`} htmlFor={`course-name-${course.id}`}>
              <Input
                id={`course-name-${course.id}`}
                value={course.name}
                onChange={(event) => update(course.id, { name: event.target.value })}
                placeholder="e.g. Algebra"
              />
            </Field>
            <Field label="Credits" htmlFor={`course-credits-${course.id}`}>
              <Input
                id={`course-credits-${course.id}`}
                type="number"
                min="0.5"
                step="0.5"
                inputMode="decimal"
                value={course.credits}
                onChange={(event) => update(course.id, { credits: event.target.value })}
              />
            </Field>
            <Field label="Grade" htmlFor={`course-grade-${course.id}`}>
              <Select
                id={`course-grade-${course.id}`}
                value={course.grade}
                onChange={(event) => update(course.id, { grade: event.target.value })}
              >
                <option value="">Select…</option>
                {Object.keys(gradePoints).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove course ${index + 1}`}
              onClick={() => setCourses((current) => current.filter((item) => item.id !== course.id))}
              disabled={courses.length === 1}
            >
              <Trash2 className="size-4 text-danger" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => setCourses((current) => [...current, emptyCourse()])}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add course
        </Button>
        <Button onClick={calculate}>
          <GraduationCap className="size-4" aria-hidden="true" />
          Calculate GPA
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? <ErrorState title="Check your courses" description={error} /> : null}

      {result ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
              Weighted GPA
            </p>
            <p className="mt-2 text-4xl font-semibold text-accent">
              {result.gpa.toFixed(2)}
            </p>
          </div>
          <div className="rounded-card border border-border bg-surface p-6 text-center">
            <p className="text-xs text-muted-foreground">Total credits</p>
            <p className="mt-2 text-2xl font-semibold">{result.credits}</p>
          </div>
          <div className="rounded-card border border-border bg-surface p-6 text-center">
            <p className="text-xs text-muted-foreground">Grade points</p>
            <p className="mt-2 text-2xl font-semibold">{result.points.toFixed(2)}</p>
          </div>
        </div>
      ) : null}
      <p className="text-xs text-subtle-foreground">
        Scale: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, D− = 0.7, F = 0.
      </p>
    </div>
  );
}
