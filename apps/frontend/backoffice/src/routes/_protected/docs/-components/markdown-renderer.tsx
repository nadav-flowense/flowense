import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { MermaidDiagram } from '@/components/diagrams';
import { CodeBlock } from './code-block';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    // Custom code block handler
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match?.[1] ?? '';
      const codeString = String(children).replace(/\n$/, '');

      // Check if it's a Mermaid diagram
      if (language === 'mermaid') {
        return <MermaidDiagram source={codeString} className="my-4" />;
      }

      // Inline code (no language specified and no newlines)
      if (!match && !codeString.includes('\n')) {
        return (
          <code
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }

      // Code block with syntax highlighting
      return <CodeBlock code={codeString} language={language} />;
    },

    // Style tables
    table({ children }) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-border">
            {children}
          </table>
        </div>
      );
    },

    thead({ children }) {
      return <thead className="bg-muted">{children}</thead>;
    },

    th({ children }) {
      return (
        <th className="border border-border px-4 py-2 text-left font-semibold">
          {children}
        </th>
      );
    },

    td({ children }) {
      return <td className="border border-border px-4 py-2">{children}</td>;
    },

    // Style headings with scroll margin for anchor links
    h1({ children, id }) {
      return (
        <h1 id={id} className="scroll-mt-20 text-3xl font-bold mt-8 mb-4">
          {children}
        </h1>
      );
    },

    h2({ children, id }) {
      return (
        <h2
          id={id}
          className="scroll-mt-20 text-2xl font-bold mt-8 mb-3 pb-2 border-b"
        >
          {children}
        </h2>
      );
    },

    h3({ children, id }) {
      return (
        <h3 id={id} className="scroll-mt-20 text-xl font-semibold mt-6 mb-2">
          {children}
        </h3>
      );
    },

    h4({ children, id }) {
      return (
        <h4 id={id} className="scroll-mt-20 text-lg font-semibold mt-4 mb-2">
          {children}
        </h4>
      );
    },

    // Style paragraphs
    p({ children }) {
      return <p className="my-4 leading-7">{children}</p>;
    },

    // Style lists
    ul({ children }) {
      return <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>;
    },

    ol({ children }) {
      return <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>;
    },

    li({ children }) {
      return <li className="leading-7">{children}</li>;
    },

    // Style links
    a({ children, href }) {
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-4 hover:text-primary/80"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },

    // Style blockquotes
    blockquote({ children }) {
      return (
        <blockquote className="my-4 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground">
          {children}
        </blockquote>
      );
    },

    // Style horizontal rules
    hr() {
      return <hr className="my-8 border-border" />;
    },

    // Style strong/bold
    strong({ children }) {
      return <strong className="font-semibold">{children}</strong>;
    },

    // Style images
    img({ src, alt }) {
      return (
        <img
          src={src}
          alt={alt || ''}
          className="my-4 rounded-lg max-w-full h-auto"
        />
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
