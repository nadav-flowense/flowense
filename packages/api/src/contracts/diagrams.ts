import { oc } from '@orpc/contract';
import * as v from 'valibot';

const DiagramTypeSchema = v.picklist([
  'mermaid',
  'plantuml',
  'graphviz',
  'ditaa',
  'blockdiag',
  'seqdiag',
  'actdiag',
  'nwdiag',
  'erd',
  'c4plantuml',
]);

const OutputFormatSchema = v.picklist(['svg', 'png']);

const diagramContract = oc
  .prefix('/diagrams')
  .tag('diagrams')
  .router({
    render: oc
      .route({
        method: 'POST',
        path: '/render',
        summary: 'Render a diagram',
        description:
          'Render a diagram using Kroki API. Supports Mermaid, PlantUML, GraphViz, and more.',
      })
      .input(
        v.object({
          source: v.pipe(
            v.string(),
            v.minLength(1),
            v.description('The diagram source code'),
          ),
          type: v.pipe(
            v.optional(DiagramTypeSchema, 'mermaid'),
            v.description('The diagram type (default: mermaid)'),
          ),
          format: v.pipe(
            v.optional(OutputFormatSchema, 'svg'),
            v.description('Output format (default: svg)'),
          ),
        }),
      )
      .output(
        v.object({
          data: v.pipe(
            v.string(),
            v.description(
              'Base64-encoded image data (for PNG) or SVG string (for SVG)',
            ),
          ),
          format: OutputFormatSchema,
          contentType: v.string(),
        }),
      ),

    types: oc
      .route({
        method: 'GET',
        path: '/types',
        summary: 'List supported diagram types',
        description: 'Get a list of all supported diagram types',
      })
      .output(
        v.array(
          v.object({
            type: v.string(),
            name: v.string(),
            description: v.string(),
          }),
        ),
      ),
  });

export default diagramContract;
