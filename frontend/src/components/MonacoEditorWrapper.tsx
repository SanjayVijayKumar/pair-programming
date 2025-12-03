'use client'

import { useEffect, useRef } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'

interface MonacoEditorWrapperProps {
  code: string
  language: string
  onChange: (value: string | undefined) => void
  onCursorChange: (position: number) => void
  theme?: string
  readOnly?: boolean
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  code,
  language,
  onChange,
  onCursorChange,
  theme = 'vs-dark',
  readOnly = false,
}) => {
  const monaco = useMonaco()
  const editorRef = useRef<any>(null)

  useEffect(() => {
    if (!monaco) return

    // Register custom theme if needed
    monaco.editor.defineTheme('vs-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
      },
    })
  }, [monaco])

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor
    editor.focus()

    // Listen to cursor changes
    editor.onDidChangeCursorPosition((e: any) => {
      const position = editor.getModel().getOffsetAt(e.position)
      onCursorChange(position)
    })

    // Listen to selection changes
    editor.onDidChangeCursorSelection((e: any) => {
      const position = editor.getModel().getOffsetAt(e.selection.getStartPosition())
      onCursorChange(position)
    })
  }

  const handleChange = (value: string | undefined) => {
    onChange(value)
  }

  return (
    <div className="w-full h-screen-minus-status border-b border-editor-border">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: true,
          readOnly,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          bracketPairColorization: {
            enabled: true,
          },
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  )
}
