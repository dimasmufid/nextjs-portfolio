'use client';

import { useEffect } from 'react';

interface MermaidRendererProps {
  chart: string;
}

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  useEffect(() => {
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({ startOnLoad: true });
      mermaid.default.contentLoaded();
    });
  }, []);

  return (
    <div className="mermaid">
      {chart}
    </div>
  );
} 