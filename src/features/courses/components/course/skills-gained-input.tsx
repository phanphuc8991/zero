"use client";

import { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { type Tag, TagInput } from "emblor-maintained";

interface SkillsGainedInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  id: string;
}

export function SkillsGainedInput<TFieldValues extends FieldValues>({
  control,
  errors,
  id,
}: SkillsGainedInputProps<TFieldValues>) {
  const [activeSkillsIndex, setActiveSkillsIndex] = useState<number | null>(
    null,
  );

  return (
    <Controller
      control={control}
      name={"skillsGained" as Path<TFieldValues>}
      render={({ field }) => {
        const emblorTags: Tag[] = (field.value || []).map(
          (val: string, idx: number) => ({
            id: String(idx),
            text: val,
          }),
        );

        return (
          <div>
            <TagInput
              maxTags={5}
              id={id}
              placeholder="Add a gained competency..."
              tags={emblorTags}
              activeTagIndex={activeSkillsIndex}
              setActiveTagIndex={setActiveSkillsIndex}
              styleClasses={{
                inlineTagsContainer: `border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 ${
                  errors.skillsGained
                    ? "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive"
                    : ""
                }`,
                input:
                  "w-full min-w-[80px] shadow-none px-2 h-7 focus:outline-none",
                tag: {
                  body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                  closeButton:
                    "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 justify-center items-center text-muted-foreground/80 hover:text-foreground cursor-pointer",
                },
              }}
              setTags={(newTags) => {
                const stringArray = (newTags as Tag[]).map((t) => t.text);
                field.onChange(stringArray);
              }}
            />
            {errors.skillsGained && (
              <p className="text-destructive text-xs mt-2" role="alert">
                {
                  (errors.skillsGained.message ||
                    (Array.isArray(errors.skillsGained) &&
                      errors.skillsGained.find(Boolean)?.message)) as string
                }
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
