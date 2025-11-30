import { Button } from '@repo/ui/components/button';
import { Textarea } from '@repo/ui/components/textarea';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { MermaidDiagram } from './mermaid-diagram';

const DEFAULT_DIAGRAM = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`;

export interface MermaidEditorProps {
  /** Initial diagram source */
  initialSource?: string;
  /** Callback when source changes */
  onSourceChange?: (source: string) => void;
  /** Whether to show the editor */
  showEditor?: boolean;
  /** Optional CSS class name */
  className?: string;
}

export function MermaidEditor({
  initialSource = DEFAULT_DIAGRAM,
  onSourceChange,
  showEditor = true,
  className = '',
}: MermaidEditorProps) {
  const [source, setSource] = useState(initialSource);
  const [renderedSvg, setRenderedSvg] = useState<string>('');

  const handleSourceChange = useCallback(
    (newSource: string) => {
      setSource(newSource);
      onSourceChange?.(newSource);
    },
    [onSourceChange],
  );

  const handleReset = useCallback(() => {
    handleSourceChange(DEFAULT_DIAGRAM);
    toast.success('Diagram reset to default');
  }, [handleSourceChange]);

  const handleCopySource = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(source);
      toast.success('Diagram source copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }, [source]);

  const handleDownloadSvg = useCallback(() => {
    if (!renderedSvg) {
      toast.error('No diagram to download');
      return;
    }

    const blob = new Blob([renderedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Diagram downloaded as SVG');
  }, [renderedSvg]);

  const handleRender = useCallback(() => {
    // Get the rendered SVG from the DOM
    const svgElement = document.querySelector('.mermaid-diagram svg');
    if (svgElement) {
      setRenderedSvg(svgElement.outerHTML);
    }
  }, []);

  return (
    <div className={`grid gap-4 ${showEditor ? 'lg:grid-cols-2' : ''} ${className}`}>
      {showEditor && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Editor</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopySource}>
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Write your Mermaid diagram code below
            </p>
          </div>
          <div className="p-6 pt-0">
            <Textarea
              value={source}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Enter Mermaid diagram code..."
            />
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Preview</h3>
            <Button variant="outline" size="sm" onClick={handleDownloadSvg}>
              <Download className="mr-1 h-4 w-4" />
              Download SVG
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Live preview of your diagram
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="min-h-[300px] flex items-center justify-center rounded-md border bg-white p-4">
            <MermaidDiagram
              source={source}
              onRender={handleRender}
              onError={(error) => toast.error(error.message)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MermaidEditor;
