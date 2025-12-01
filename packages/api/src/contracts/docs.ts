import { oc } from '@orpc/contract';
import * as v from 'valibot';

const docNotFoundError = {
  DOC_NOT_FOUND: {
    status: 404,
    data: v.object({
      slug: v.string(),
    }),
  },
} as const;

const docContract = oc
  .prefix('/docs')
  .tag('docs')
  .router({
    list: oc
      .route({
        method: 'GET',
        path: '/',
        summary: 'List all documentation files',
        description: 'Retrieve a list of all available markdown documentation files',
      })
      .output(
        v.array(
          v.object({
            slug: v.string(),
            title: v.string(),
            description: v.optional(v.string()),
            lastModified: v.string(),
          }),
        ),
      ),

    get: oc
      .route({
        method: 'GET',
        path: '/{slug}',
        summary: 'Get documentation content',
        description: 'Retrieve the full markdown content of a documentation file',
      })
      .errors(docNotFoundError)
      .input(v.object({ slug: v.string() }))
      .output(
        v.object({
          slug: v.string(),
          title: v.string(),
          content: v.string(),
          lastModified: v.string(),
          headings: v.array(
            v.object({
              level: v.number(),
              text: v.string(),
              id: v.string(),
            }),
          ),
        }),
      ),

    search: oc
      .route({
        method: 'GET',
        path: '/search',
        summary: 'Search documentation',
        description: 'Search across all documentation content',
      })
      .input(v.object({ query: v.pipe(v.string(), v.minLength(2)) }))
      .output(
        v.array(
          v.object({
            slug: v.string(),
            title: v.string(),
            matches: v.array(
              v.object({
                context: v.string(),
                lineNumber: v.number(),
              }),
            ),
          }),
        ),
      ),
  });

export default docContract;
