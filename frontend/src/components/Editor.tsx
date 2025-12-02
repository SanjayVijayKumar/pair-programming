import React, { useRef, useEffect } from "react";

interface EditorProps {
  code: string;
  onChange: (code: string, cursorPosition: number) => void;
  suggestion?: string | null;
}

export function Editor({ code, onChange, suggestion }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Update textarea if code changes from remote
    if (textareaRef.current && textareaRef.current.value !== code) {
      const cursorPos = textareaRef.current.selectionStart;
      textareaRef.current.value = code;
      // Try to preserve cursor position
      if (cursorPos <= code.length) {
        textareaRef.current.setSelectionRange(cursorPos, cursorPos);
      }
    }
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    const cursorPosition = e.target.selectionStart;
    onChange(newCode, cursorPosition);
  };

  return (
    <div className="editor-wrapper">
      <textarea
        ref={textareaRef}
        value={code}
        onChange={handleChange}
        placeholder="Start typing your code here..."
        className="editor-textarea"
        spellCheck="false"
      />
      {suggestion && (
        <div className="suggestion-box">
          <strong>Suggestion:</strong> {suggestion}
        </div>
      )}
    </div>
  );
}
