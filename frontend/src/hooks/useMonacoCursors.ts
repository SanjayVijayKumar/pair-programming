import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Editor } from '@monaco-editor/react'
import { RootState } from '@/store/store'

interface IStandaloneCodeEditor {
  deltaDecorations: (decorations: any[], deltas: any[]) => any[]
  getCursorPosition: () => any
  updateOptions: (options: any) => void
  getModel: () => any
}

export const useMonacoCursors = (editor: IStandaloneCodeEditor | null) => {
  const usersCursors = useSelector((state: RootState) => state.room.usersCursors)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!editor) return

    const decorations = Object.entries(usersCursors).map(
      ([userId, cursor]) => ({
        range: {
          startLineNumber: editor.getModel().getPositionAt(cursor.position)
            .lineNumber,
          startColumn: editor.getModel().getPositionAt(cursor.position).column,
          endLineNumber: editor.getModel().getPositionAt(cursor.position)
            .lineNumber,
          endColumn:
            editor.getModel().getPositionAt(cursor.position).column + 1,
        },
        options: {
          className: 'cursor-decoration',
          glyphMarginClassName: 'glyph-margin-decoration',
          glyphMarginHoverMessage: { value: userId },
          before: {
            content: '│',
            inlineClassName: 'other-cursor',
            inlineClassNameRules: [
              {
                token: '',
                backgroundColor: cursor.color,
              },
            ],
          },
        },
      })
    )

    editor.deltaDecorations([], decorations)
  }, [usersCursors, editor])
}
