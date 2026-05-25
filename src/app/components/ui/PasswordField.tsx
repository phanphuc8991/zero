"use client";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
interface PasswordFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: FieldError;
  label: string;
  onChange?: () => void;
}

export function PasswordField<T extends FieldValues>({
  register,
  name,
  error,
  label,
  onChange,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="relative">
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={20} className="text-primary/20" />
          ) : (
            <Eye size={20} className="text-primary/20 " />
          )}
        </button>

        <input
          {...register(name, { onChange })}
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="off"
          className={`w-full rounded-full border border-primary/20 outline-none px-5 py-3 text-primary dark:text-creamwhite dark:border-stroke focus:border-primary/60 dark:focus:border-creamwhite/60 ${
            error && "border-red-500 focus:border-red-500"
          }`}
        />
      </div>
    </div>
  );
}
