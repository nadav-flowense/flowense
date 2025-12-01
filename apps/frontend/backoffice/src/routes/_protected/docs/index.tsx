import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type { RouterOutput } from '@repo/api/client';
import { Input } from '@repo/ui/components/input';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  type SearchSchemaInput,
  stripSearchParams,
  useNavigate,
} from '@tanstack/react-router';
import * as v from 'valibot';
import { apiClient } from '@/clients/apiClient';
import { queryClient } from '@/clients/queryClient';
import {
  type DocsSearchSchema,
  docsSearchDefaults,
  docsSearchSchema,
} from './-validations/docs-link-options';

export const Route = createFileRoute('/_protected/docs/')({
  loader: () => queryClient.ensureQueryData(apiClient.docs.list.queryOptions()),
  component: DocsListPage,
  validateSearch: (input: SearchSchemaInput) =>
    v.parse(docsSearchSchema, input),
  search: {
    middlewares: [stripSearchParams(docsSearchDefaults)],
  },
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center w-full gap-y-3">
      <div>{error.message}</div>
    </div>
  ),
});

function DocCard({
  doc,
}: Readonly<{
  doc: RouterOutput['docs']['list'][number];
}>) {
  return (
    <Link
      to="/docs/$slug"
      params={{ slug: doc.slug }}
      className="block p-4 border rounded-lg bg-elevated hover:bg-accent transition-colors"
    >
      <h2 className="text-lg font-semibold line-clamp-2">{doc.title}</h2>
      {doc.description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {doc.description}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        Last updated: {new Date(doc.lastModified).toLocaleDateString()}
      </p>
    </Link>
  );
}

function DocsListPage() {
  const { data: docs } = useQuery(apiClient.docs.list.queryOptions());
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const updateFilters = (name: keyof DocsSearchSchema, value: unknown) => {
    navigate({ search: (prev: DocsSearchSchema) => ({ ...prev, [name]: value }) });
  };

  const lowercaseSearch = search.searchString.toLowerCase();
  const filteredDocs = docs?.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowercaseSearch) ||
      doc.description?.toLowerCase().includes(lowercaseSearch),
  );

  return (
    <div className="flex flex-col p-1.5 md:p-4 w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">
          Browse the project documentation and guides
        </p>
      </div>

      <hr className="mt-4 border-b-2 border-gray-400" />

      <div className="mt-4 flex justify-end items-center relative">
        <div className="relative sm:max-w-80 w-full">
          <Input
            value={search.searchString}
            onChange={(e) => updateFilters('searchString', e.target.value)}
            placeholder="Search documentation..."
            className="w-full pr-10 placeholder:italic peer"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-input peer-focus:text-foreground transition-colors" />
        </div>
      </div>

      <div className="grid gap-4 mt-6 md:grid-cols-2">
        {filteredDocs?.length ? (
          filteredDocs.map((doc) => <DocCard key={doc.slug} doc={doc} />)
        ) : (
          <p className="text-muted-foreground col-span-2">
            {docs?.length === 0
              ? 'No documentation available.'
              : 'No documentation matches your search.'}
          </p>
        )}
      </div>
    </div>
  );
}
