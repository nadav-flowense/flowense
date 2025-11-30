import { publicProcedure } from '../orpc';

const KROKI_URL = 'https://kroki.io';

const DIAGRAM_TYPES = [
  {
    type: 'mermaid',
    name: 'Mermaid',
    description:
      'Flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, Gantt charts, and more',
  },
  {
    type: 'plantuml',
    name: 'PlantUML',
    description: 'UML diagrams including class, sequence, use case, and more',
  },
  {
    type: 'graphviz',
    name: 'GraphViz',
    description: 'Graph visualization using DOT language',
  },
  {
    type: 'ditaa',
    name: 'Ditaa',
    description: 'ASCII art to diagram converter',
  },
  {
    type: 'blockdiag',
    name: 'BlockDiag',
    description: 'Simple block diagrams',
  },
  {
    type: 'seqdiag',
    name: 'SeqDiag',
    description: 'Sequence diagrams',
  },
  {
    type: 'actdiag',
    name: 'ActDiag',
    description: 'Activity diagrams',
  },
  {
    type: 'nwdiag',
    name: 'NwDiag',
    description: 'Network diagrams',
  },
  {
    type: 'erd',
    name: 'ERD',
    description: 'Entity-relationship diagrams',
  },
  {
    type: 'c4plantuml',
    name: 'C4 PlantUML',
    description: 'C4 model architecture diagrams',
  },
] as const;

const diagramsRouter = {
  render: publicProcedure.diagrams.render.handler(async ({ input }) => {
    const { source, type, format } = input;

    // Encode the diagram source for Kroki API
    const encodedSource = Buffer.from(source, 'utf-8').toString('base64url');

    const krokiUrl = `${KROKI_URL}/${type}/${format}/${encodedSource}`;

    const response = await fetch(krokiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kroki API error: ${response.status} - ${errorText}`);
    }

    const contentType =
      format === 'svg' ? 'image/svg+xml' : `image/${format}`;

    if (format === 'svg') {
      const svgData = await response.text();
      return {
        data: svgData,
        format: format as 'svg' | 'png',
        contentType,
      };
    }

    // For PNG, return base64-encoded data
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    return {
      data: base64Data,
      format: format as 'svg' | 'png',
      contentType,
    };
  }),

  types: publicProcedure.diagrams.types.handler(() => {
    return [...DIAGRAM_TYPES];
  }),
};

export default diagramsRouter;
