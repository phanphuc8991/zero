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
import { Category } from "@/features/courses/contants";

interface CategorySelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  categories: Category[];
}

export function CategorySelect<TFieldValues extends FieldValues>({
  control,
  errors,
  categories,
}: CategorySelectProps<TFieldValues>) {
  return (
    <div>
      <Controller
        control={control}
        name={"categoryId" as Path<TFieldValues>}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              aria-invalid={!!errors.categoryId}
              id="categoryId"
              ref={field.ref}
              className="w-full"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {errors.categoryId && (
        <p
          aria-live="polite"
          className="text-destructive text-xs mt-2"
          role="alert"
        >
          {errors.categoryId.message as string}
        </p>
      )}
    </div>
  );
}
