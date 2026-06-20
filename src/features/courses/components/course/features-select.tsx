"use client";

import { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { courseFeaturesList } from "@/features/courses/contants-1";

interface FeaturesSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
}

export function FeaturesSelect<TFieldValues extends FieldValues>({
  control,
  errors,
}: FeaturesSelectProps<TFieldValues>) {
  const [openFeatures, setOpenFeatures] = useState(false);

  return (
    <div className="w-full">
      <Controller
        control={control}
        name={"features" as Path<TFieldValues>}
        render={({ field }) => {
          const selectedValues: string[] = field.value || [];

          const handleUnselect = (itemValue: string) => {
            field.onChange(selectedValues.filter((v) => v !== itemValue));
          };

          const handleSelect = (currentValue: string) => {
            const updatedValues = selectedValues.includes(currentValue)
              ? selectedValues.filter((v) => v !== currentValue)
              : [...selectedValues, currentValue];
            field.onChange(updatedValues);
          };

          return (
            <>
              <Popover open={openFeatures} onOpenChange={setOpenFeatures}>
                <PopoverTrigger asChild>
                  <Button
                    id="course-features"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openFeatures}
                    className={cn(
                      "w-full justify-between min-h-10 h-auto p-2 border-input text-left font-normal shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50",
                      errors.features
                        ? "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive"
                        : "",
                    )}
                  >
                    <div className="flex gap-1 flex-wrap items-center">
                      {selectedValues.length === 0 && (
                        <span className="text-muted-foreground text-sm">
                          Select features...
                        </span>
                      )}
                      {selectedValues.map((valueItem) => {
                        const featureObj = courseFeaturesList.find(
                          (f) => f.value === valueItem,
                        );
                        return (
                          <Badge
                            variant="secondary"
                            key={valueItem}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleUnselect(valueItem);
                            }}
                          >
                            {featureObj ? featureObj.label : valueItem}
                            <span
                              role="button"
                              className="ml-0.5 rounded-full text-muted-foreground/80 hover:text-foreground cursor-pointer"
                              onClick={() => handleUnselect(valueItem)}
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </Badge>
                        );
                      })}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-(--radix-popover-trigger-width) p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search feature..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No feature found.</CommandEmpty>
                      <CommandGroup>
                        {courseFeaturesList.map((feature) => (
                          <CommandItem
                            key={feature.value}
                            value={feature.value}
                            onSelect={() => handleSelect(feature.value)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedValues.includes(feature.value)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {feature.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.features && (
                <p className="text-destructive text-xs mt-2" role="alert">
                  {errors.features.message as string}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
