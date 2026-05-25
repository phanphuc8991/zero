"use client";

import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  error?: FieldError;
  onChange?: () => void;
}

export function InputField<T extends FieldValues>({
  register,
  name,
  label,
  placeholder,
  error,
  onChange,
}: InputFieldProps<T>) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={name}
          className="text-[15px] font-medium leading-8.75 text-primary"
        >
          {label}
        </label>
        {error && (
          <p className="text-[13px] text-red-500 opacity-80">{error.message}</p>
        )}
      </div>
      <div>
        <input
          {...register(name, { onChange })}
          id={name}
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-full border border-primary/20 outline-none px-5 py-3 text-primary dark:text-creamwhite dark:border-stroke focus:border-primary/60 dark:focus:border-creamwhite/60 ${
            error && "border-red-500 focus:border-red-500"
          }`}
        />
      </div>
    </div>
  );
}
