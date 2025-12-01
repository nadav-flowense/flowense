import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { protectedProcedure } from '../orpc';

// Path to docs folder - resolve from project root
// When running from apps/backend/api, we go up 3 levels to project root
const DOCS_DIR = resolve(process.cwd(), '..', '..', '..', 'docs');

// Helper: Extract title from markdown (first H1 or filename)
function extractTitle(content: string, filename: string): string {
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match?.[1]) {
    return h1Match[1].trim();
  }
  return filename
    .replace(/-/g, ' ')
    .replace(/\.md$/, '')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Helper: Extract first paragraph as description
function extractDescription(content: string): string | undefined {
  const lines = content.split('\n');
  let foundHeading = false;
  for (const line of lines) {
    if (line.startsWith('#')) {
      foundHeading = true;
      continue;
    }
    if (foundHeading && line.trim() && !line.startsWith('#') && !line.startsWith('|') && !line.startsWith('```')) {
      return line.trim().slice(0, 200);
    }
  }
  return undefined;
}

// Helper: Extract all headings for TOC
function extractHeadings(
  content: string,
): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];

  for (const match of content.matchAll(headingRegex)) {
    const levelMatch = match[1];
    const textMatch = match[2];
    if (!levelMatch || !textMatch) continue;

    const level = levelMatch.length;
    const text = textMatch.trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ level, text, id });
  }

  return headings;
}

// Helper: Slugify filename
function slugify(filename: string): string {
  return filename.replace(/\.md$/, '');
}

const docsRouter = {
  list: protectedProcedure.docs.list.handler(async () => {
    try {
      const files = await readdir(DOCS_DIR);
      const mdFiles = files.filter((f) => f.endsWith('.md'));

      const docs = await Promise.all(
        mdFiles.map(async (filename) => {
          const filePath = join(DOCS_DIR, filename);
          const [content, stats] = await Promise.all([
            readFile(filePath, 'utf-8'),
            stat(filePath),
          ]);

          return {
            slug: slugify(filename),
            title: extractTitle(content, filename),
            description: extractDescription(content),
            lastModified: stats.mtime.toISOString(),
          };
        }),
      );

      // Sort by last modified (newest first)
      return docs.sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime(),
      );
    } catch (error) {
      console.error('Error reading docs directory:', error);
      return [];
    }
  }),

  get: protectedProcedure.docs.get.handler(async ({ input, errors }) => {
    const filename = `${input.slug}.md`;
    const filePath = join(DOCS_DIR, filename);

    try {
      const [content, stats] = await Promise.all([
        readFile(filePath, 'utf-8'),
        stat(filePath),
      ]);

      return {
        slug: input.slug,
        title: extractTitle(content, filename),
        content,
        lastModified: stats.mtime.toISOString(),
        headings: extractHeadings(content),
      };
    } catch {
      throw errors.DOC_NOT_FOUND({
        message: `Documentation file "${input.slug}" not found`,
        data: { slug: input.slug },
      });
    }
  }),

  search: protectedProcedure.docs.search.handler(async ({ input }) => {
    try {
      const files = await readdir(DOCS_DIR);
      const mdFiles = files.filter((f) => f.endsWith('.md'));
      const query = input.query.toLowerCase();

      const results = await Promise.all(
        mdFiles.map(async (filename) => {
          const filePath = join(DOCS_DIR, filename);
          const content = await readFile(filePath, 'utf-8');
          const lines = content.split('\n');

          const matches: Array<{ context: string; lineNumber: number }> = [];

          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query)) {
              matches.push({
                context: line.slice(0, 150).trim(),
                lineNumber: index + 1,
              });
            }
          });

          if (matches.length === 0) return null;

          return {
            slug: slugify(filename),
            title: extractTitle(content, filename),
            matches: matches.slice(0, 5), // Limit to 5 matches per doc
          };
        }),
      );

      return results.filter((r): r is NonNullable<typeof r> => r !== null);
    } catch (error) {
      console.error('Error searching docs:', error);
      return [];
    }
  }),
};

export default docsRouter;
