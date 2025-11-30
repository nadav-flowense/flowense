import { desc, eq } from '@repo/db';
import { flow, user } from '@repo/db/schema';
import { protectedProcedure } from '../orpc';

const flowRouter = {
  all: protectedProcedure.flows.all.handler(({ context }) => {
    return context.db.query.flow.findMany({
      columns: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: desc(flow.createdAt),
    });
  }),

  one: protectedProcedure.flows.one.handler(
    async ({ context, input, errors }) => {
      const [dbFlow] = await context.db
        .select({
          id: flow.id,
          title: flow.title,
          content: flow.content,
          createdAt: flow.createdAt,
          author: {
            id: user.id,
            name: user.name,
          },
        })
        .from(flow)
        .innerJoin(user, eq(flow.createdBy, user.id))
        .where(eq(flow.id, input.id));

      if (!dbFlow) {
        throw errors.MISSING_FLOW({
          message: `No such flow with ID ${input.id}`,
          data: {
            flowId: input.id,
          },
        });
      }
      return dbFlow;
    },
  ),

  create: protectedProcedure.flows.create.handler(
    async ({ context, input }) => {
      await context.db.insert(flow).values({
        createdBy: context.session.user.id,
        ...input,
      });
      return {};
    },
  ),

  delete: protectedProcedure.flows.delete.handler(
    async ({ context, input, errors }) => {
      const res = await context.db.delete(flow).where(eq(flow.id, input.id));
      if (res.rowCount === 0) {
        throw errors.MISSING_FLOW({
          message: `No such flow with ID ${input.id}`,
          data: {
            flowId: input.id,
          },
        });
      }
      return {};
    },
  ),
};

export default flowRouter;
