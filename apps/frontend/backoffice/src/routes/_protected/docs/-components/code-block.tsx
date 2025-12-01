import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState<string>('');

  useEffect(() => {
    codeToHtml(code, {
      lang: language || 'text',
      theme: 'github-dark',
    })
      .then(setHighlighted)
      .catch(() => {
        // Fallback for unsupported languages
        setHighlighted('');
      });
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {language && (
        <div className="absolute top-2 left-3 text-xs text-muted-foreground z-10">
          {language}
        </div>
      )}

      {highlighted ? (
        <div
          className="rounded-lg overflow-hidden [&>pre]:p-4 [&>pre]:pt-8 [&>pre]:overflow-x-auto [&>pre]:text-sm"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <pre className="bg-zinc-900 text-zinc-100 p-4 pt-8 rounded-lg overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
