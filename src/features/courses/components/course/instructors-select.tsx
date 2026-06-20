"use client";

import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Instructor } from "@/features/courses/contants";

interface InstructorSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  instructors: Instructor[];
}

export function InstructorSelect<TFieldValues extends FieldValues>({
  control,
  errors,
  instructors,
}: InstructorSelectProps<TFieldValues>) {
  return (
    <div>
      <Controller
        control={control}
        name={"instructorId" as Path<TFieldValues>}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id="course-instructor"
              aria-invalid={!!errors.instructorId}
              ref={field.ref}
              className="w-full"
            >
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={String(instructor.id)}>
                    {instructor.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {errors.instructorId && (
        <p
          aria-live="polite"
          className="text-destructive text-xs mt-2"
          role="alert"
        >
          {errors.instructorId.message as string}
        </p>
      )}
    </div>
  );
}
