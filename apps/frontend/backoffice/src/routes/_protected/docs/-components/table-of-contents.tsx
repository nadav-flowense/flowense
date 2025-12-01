import { useEffect, useState } from 'react';

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0% -80% 0%' },
    );

    for (const { id } of headings) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  // Filter to only show h2 and h3 (h1 is the title)
  const tocHeadings = headings.filter((h) => h.level >= 2 && h.level <= 3);

  if (tocHeadings.length === 0) return null;

  return (
    <nav className="text-sm">
      <h4 className="font-semibold mb-3 text-foreground">On this page</h4>
      <ul className="space-y-2">
        {tocHeadings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors hover:text-foreground ${
                activeId === heading.id
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
