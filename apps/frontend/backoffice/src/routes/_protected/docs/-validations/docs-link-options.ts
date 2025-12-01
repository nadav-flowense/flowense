import { linkOptions } from '@tanstack/react-router';
import * as v from 'valibot';

export const docsSearchSchema = v.object({
  searchString: v.fallback(v.string(), ''),
});

export type DocsSearchSchema = v.InferOutput<typeof docsSearchSchema>;

export const docsSearchDefaults = v.getFallbacks(docsSearchSchema);

export const docsLinkOptions = linkOptions({
  to: '/docs',
});
