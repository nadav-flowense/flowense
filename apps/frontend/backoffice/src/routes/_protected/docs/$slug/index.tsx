import { ArrowLeftIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { apiClient } from '@/clients/apiClient';
import { queryClient } from '@/clients/queryClient';
import { MarkdownRenderer, TableOfContents } from '../-components';
import { docsLinkOptions } from '../-validations/docs-link-options';

export const Route = createFileRoute('/_protected/docs/$slug/')({
  loader: ({ params }) =>
    queryClient.ensureQueryData(
      apiClient.docs.get.queryOptions({ input: { slug: params.slug } }),
    ),
  component: DocViewerPage,
  errorComponent: ({ error, reset }) => (
    <div className="flex flex-col items-center w-full gap-y-3 p-8">
      <div className="text-destructive">{error.message}</div>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link {...docsLinkOptions}>
            <ArrowLeftIcon />
            Back to Docs
          </Link>
        </Button>
        <Button variant="secondary" onClick={() => reset()}>
          Retry <ReloadIcon />
        </Button>
      </div>
    </div>
  ),
});

function DocViewerPage() {
  const doc = Route.useLoaderData();

  return (
    <div className="flex max-w-7xl mx-auto">
      {/* Main Content */}
      <article className="flex-1 p-4 md:p-6 max-w-4xl min-w-0">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link {...docsLinkOptions}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Docs
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{doc.title}</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(doc.lastModified).toLocaleString()}
          </p>
        </header>

        <div className="prose-container">
          <MarkdownRenderer content={doc.content} />
        </div>
      </article>

      {/* Table of Contents Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-4 p-4 border-l">
          <TableOfContents headings={doc.headings} />
        </div>
      </aside>
    </div>
  );
}
