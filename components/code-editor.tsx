"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  label,
  placeholder,
}: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setLineCount(newValue.split("\n").length);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 border-r flex flex-col items-center pt-3 text-xs text-muted-foreground font-mono select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="font-mono text-sm min-h-[300px] pl-14 resize-y"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
