'use client';

import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { indentUnit } from '@codemirror/language';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

type CodeEditorProps = {
  language: string;
  value: string;
  onChange: (value: string) => void;
};

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const extensions = useMemo(() => {
    switch (language) {
      case 'Python':
        return [python()];
      case 'Java':
        return [java()];
      case 'C++':
        return [cpp()];
      default:
        return [javascript()];
    }
  }, [language]);

  return (
    <CodeMirror
      value={value}
      height="320px"
      theme="dark"
      extensions={[...extensions, indentUnit.of('    ')]}
      onChange={onChange}
      aria-label={`${language} code editor`}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        autocompletion: true,
        indentOnInput: true,
      }}
    />
  );
}
