import backofficeRouter from './backoffice';
import diagramsRouter from './diagrams';
import docsRouter from './docs';
import flowRouter from './flow';

export const appRouter = {
  backoffice: backofficeRouter,
  diagrams: diagramsRouter,
  docs: docsRouter,
  flows: flowRouter,
};
