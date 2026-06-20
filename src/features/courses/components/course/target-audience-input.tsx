"use client";

import { useState } from "react";
import { type Tag, TagInput } from "emblor-maintained";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

interface TargetAudienceInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  id: string;
}

export function TargetAudienceInput<TFieldValues extends FieldValues>({
  control,
  errors,
  id,
}: TargetAudienceInputProps<TFieldValues>) {
  const [activeTargetIndex, setActiveTargetIndex] = useState<number | null>(
    null,
  );
  return (
    <Controller
      control={control}
      name={"targetAudience" as Path<TFieldValues>}
      render={({ field }) => {
        const currentStringArray = field.value || [];
        const emblorTags: Tag[] = currentStringArray.map(
          (textValue: string, index: number) => ({
            id: `target-${index}-${textValue}`,
            text: textValue,
          }),
        );
        return (
          <div>
            <TagInput
              maxTags={5}
              id={id}
              placeholder="Add targeted learner..."
              tags={emblorTags}
              activeTagIndex={activeTargetIndex}
              setActiveTagIndex={setActiveTargetIndex}
              styleClasses={{
                inlineTagsContainer: `border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 ${
                  errors.targetAudience
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
                const updatedTags =
                  typeof newTags === "function" ? newTags(emblorTags) : newTags;
                const pureStringArray = updatedTags.map(
                  (tagItem) => tagItem.text,
                );
                field.onChange(pureStringArray);
              }}
            />
            {errors.targetAudience && (
              <p className="text-destructive text-xs mt-2" role="alert">
                {
                  (errors.targetAudience.message ||
                    (Array.isArray(errors.targetAudience) &&
                      errors.targetAudience.find(Boolean)?.message)) as string
                }
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
