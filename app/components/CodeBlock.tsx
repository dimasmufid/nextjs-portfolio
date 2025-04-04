'use client';

import { useEffect } from 'react';
import { highlight } from 'sugar-high';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  // Special handling for JavaScript code
  const formattedCode = ['js', 'ts', 'javascript', 'typescript', 'python', 'c', 'py'].includes(language)
    ? code
    : code;
  
  // Apply highlight.js to the code block
  const highlightedCode = highlight(formattedCode);

  return (
    <pre className={`language-${language || 'plaintext'}`}>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
} 