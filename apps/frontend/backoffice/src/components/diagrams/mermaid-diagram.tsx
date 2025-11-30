import mermaid from 'mermaid';
import { useEffect, useId, useRef, useState } from 'react';

export interface MermaidDiagramProps {
  /** The Mermaid diagram source code */
  source: string;
  /** Optional CSS class name */
  className?: string;
  /** Theme for the diagram */
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  /** Callback when diagram is rendered */
  onRender?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

// Initialize mermaid once
let initialized = false;

export function MermaidDiagram({
  source,
  className = '',
  theme = 'default',
  onRender,
  onError,
}: MermaidDiagramProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme,
        securityLevel: 'strict',
        fontFamily: 'inherit',
      });
      initialized = true;
    }
  }, [theme]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!source.trim()) {
        setSvg('');
        return;
      }

      try {
        // Generate a valid DOM id (replace colons which useId produces)
        const elementId = `mermaid-${id.replace(/:/g, '-')}`;

        const { svg: renderedSvg } = await mermaid.render(elementId, source);
        setSvg(renderedSvg);
        setError(null);
        onRender?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setSvg('');
        onError?.(error);
      }
    };

    renderDiagram();
  }, [source, id, onRender, onError]);

  if (error) {
    return (
      <div className={`mermaid-error rounded-md border border-red-300 bg-red-50 p-4 text-red-700 ${className}`}>
        <p className="font-semibold">Diagram Error</p>
        <pre className="mt-2 text-sm whitespace-pre-wrap">{error.message}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-diagram ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default MermaidDiagram;
