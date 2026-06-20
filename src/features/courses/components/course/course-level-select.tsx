"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseLevelSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
}

export function CourseLevelSelect<TFieldValues extends FieldValues>({
  control,
}: CourseLevelSelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={"level" as Path<TFieldValues>}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger id="course-level" ref={field.ref} className="w-full">
            <SelectValue placeholder="Select target level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="All Levels">All Levels</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
}
