'use client';

import { CustomMDX } from './mdx';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

const MermaidRenderer = dynamic(() => import('./MermaidRenderer'), { ssr: false });
const CodeBlock = dynamic(() => import('./CodeBlock'), { ssr: false });

interface CodeBlockType {
  id: string;
  language: string;
  code: string;
}

interface MermaidDiagramType {
  id: string;
  chart: string;
}

interface BlogContentProps {
  content: string;
  codeBlocks: CodeBlockType[];
  mermaidDiagrams: MermaidDiagramType[];
}

export default function BlogContent({ content, codeBlocks, mermaidDiagrams }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Replace placeholders with actual components after the content is rendered
  useEffect(() => {
    if (!contentRef.current) return;

    // Replace code placeholders
    const codePlaceholders = contentRef.current.querySelectorAll('.code-placeholder');
    codePlaceholders.forEach((placeholder) => {
      const idAttribute = placeholder.getAttribute('data-id');
      if (!idAttribute) return;
      
      const id = idAttribute;
      const codeBlock = codeBlocks.find(block => block.id === id);
      
      if (codeBlock) {
        const codeElement = document.createElement('div');
        codeElement.id = id;
        codeElement.className = 'my-4';
        placeholder.parentNode?.replaceChild(codeElement, placeholder);
        
        // Render the CodeBlock component into this element
        const codeBlockElement = document.createElement('pre');
        codeBlockElement.className = `language-${codeBlock.language || 'plaintext'}`;
        const codeContent = document.createElement('code');
        import('sugar-high').then(({ highlight }) => {
          codeContent.innerHTML = highlight(codeBlock.code);
          codeBlockElement.appendChild(codeContent);
          codeElement.appendChild(codeBlockElement);
        });
      }
    });

    // Replace mermaid placeholders
    const mermaidPlaceholders = contentRef.current.querySelectorAll('.mermaid-placeholder');
    mermaidPlaceholders.forEach((placeholder) => {
      const idAttribute = placeholder.getAttribute('data-id');
      if (!idAttribute) return;
      
      const id = idAttribute;
      const diagram = mermaidDiagrams.find(d => d.id === id);
      
      if (diagram) {
        const mermaidElement = document.createElement('div');
        mermaidElement.id = id;
        mermaidElement.className = 'my-4 mermaid';
        mermaidElement.textContent = diagram.chart;
        placeholder.parentNode?.replaceChild(mermaidElement, placeholder);
        
        // Initialize the mermaid diagram
        import('mermaid').then((mermaid) => {
          mermaid.default.initialize({ startOnLoad: true });
          mermaid.default.contentLoaded();
        });
      }
    });
  }, [codeBlocks, mermaidDiagrams]);

  return (
    <div ref={contentRef}>
      <CustomMDX source={content} />
    </div>
  );
} 