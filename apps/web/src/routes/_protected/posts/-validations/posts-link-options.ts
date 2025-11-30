import { linkOptions } from '@tanstack/react-router';
import * as v from 'valibot';

export const flowsSearchSchema = v.object({
  searchString: v.fallback(v.string(), ''),
  sortDirection: v.fallback(v.picklist(['asc', 'desc']), 'desc'),
});

export type FlowSearchSchema = v.InferOutput<typeof flowsSearchSchema>;

export const flowsSearchDefaults = v.getFallbacks(flowsSearchSchema);

export const flowsLinkOptions = linkOptions({
  to: '/flows',

  /**
   * If we want links to contain default values in the URL
   */
  // search: flowsSearchDefaults,
});
