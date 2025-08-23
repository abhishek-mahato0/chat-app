import { useState } from "react";
import { Eye, EyeOff, Search } from "lucide-react";
import clsx from "clsx";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";

interface FormComponentProps {
  type?: "text" | "password" | "search";
  label?: string;
  placeholder?: string;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormComponent: React.FC<FormComponentProps> = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = () => {
    if (type === "search") return <Search className="h-5 w-5 text-gray-400" />;
    if (type === "password")
      return showPassword ? (
        <EyeOff
          className="h-5 w-5 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
      ) : (
        <Eye
          className="h-5 w-5 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
      );
    return null;
  };

  return (
    <div className="w-full space-y-2">
      {label && <Label className="text-gray-200">{label}</Label>}
      <div
        className={clsx(
          "flex items-center gap-2 rounded-lg mt-1 border px-3 py-[0.4rem] bg-gray-800 transition-all",
          isFocused ? "border-gray-400" : "border-gray-600"
        )}
      >
        {type === "search" && renderIcon()}
        <Input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required = {required}
        />
        {type === "password" && renderIcon()}
      </div>
    </div>
  );
};
