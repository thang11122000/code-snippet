"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  language?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  label,
  placeholder,
  language,
  readOnly = false,
}: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLineCount(value.split("\n").length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) onChange(newValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative border rounded-lg overflow-hidden bg-background">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            {language && <span className="ml-2 font-medium">{language}</span>}
          </div>
          <div className="text-xs">{value.length} characters</div>
        </div>

        {/* Editor Content */}
        <div className="relative">
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/30 border-r flex flex-col items-center pt-3 text-xs text-muted-foreground font-mono select-none z-10">
            {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Textarea */}
          <Textarea
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`font-mono text-sm min-h-[400px] pl-14 pr-4 pt-3 pb-3 resize-none border-0 focus:ring-0 focus:outline-none ${
              isFocused ? "bg-background" : "bg-muted/10"
            } ${readOnly ? "cursor-default" : ""}`}
            spellCheck={false}
            style={{ lineHeight: "1.5" }}
          />
        </div>

        {/* Editor Footer
        {value && (
          <div className="px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>
                Line {lineCount}, Column{" "}
                {value.split("\n")[value.split("\n").length - 1]?.length || 0}
              </span>
              <span>{value.split("\n").length} lines</span>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
