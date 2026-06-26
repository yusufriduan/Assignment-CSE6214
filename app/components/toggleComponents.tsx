import { useState } from "react";

type ToggleProps = {
  label?: string;
  initial?: boolean;
  onToggle?: (state: boolean) => void;
  activeText?: string;
  inactiveText?: string;
};

export default function Toggle({ label, initial = false, onToggle, activeText = "Enabled", inactiveText = "Disabled" }: ToggleProps) {
  const [enabled, setEnabled] = useState(initial);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle?.(newState);
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-8 w-full items-center rounded-full transition-colors cursor-pointer ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute text-1 font-medium select-none transition-all duration-300 ${
            enabled 
              ? "left-4 text-black" 
              : "right-3 text-gray-500"
          }`}
        >
          {enabled ? activeText : inactiveText}
        </span>
        <span
          className={`inline-block h-full w-1/2 transform rounded-full bg-white transition-transform shadow-md ${
            enabled ? "translate-x-full" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}