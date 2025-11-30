import { oc } from '@orpc/contract';
import { CreateFlowSchema } from '@repo/db/schema';
import * as v from 'valibot';

const flowWithIdErrors = {
  MISSING_FLOW: {
    status: 404,
    data: v.object({
      flowId: v.string(),
    }),
  },
} as const;

const flowContract = oc
  .prefix('/flows')
  .tag('flow')
  .router({
    all: oc
      .route({
        method: 'GET',
        path: '/',
        summary: 'List all flows',
        description: 'Retrieve all flows from all users',
      })
      .output(
        v.array(
          v.object({
            id: v.string(),
            title: v.string(),
            createdAt: v.string(),
          }),
        ),
      ),

    one: oc
      .route({
        method: 'GET',
        path: '/{id}',
        summary: 'Retrieve a flow',
        description:
          'Retrieve the full details of a flow using its unique identifier',
      })
      .errors(flowWithIdErrors)
      .input(v.object({ id: v.pipe(v.string(), v.uuid()) }))
      .output(
        v.object({
          id: v.string(),
          title: v.string(),
          content: v.string(),
          createdAt: v.string(),
          author: v.object({
            id: v.string(),
            name: v.string(),
          }),
        }),
      ),

    create: oc
      .route({
        method: 'POST',
        path: '/',
        summary: 'Create a new flow',
        description: 'Create a new flow with title and content.',
      })
      .input(CreateFlowSchema)
      .output(v.object({})),

    delete: oc
      .route({
        method: 'DELETE',
        path: '/{id}',
        summary: 'Delete a flow',
        description: 'Permanently remove a flow using its unique identifier',
      })
      .errors(flowWithIdErrors)
      .input(v.object({ id: v.pipe(v.string(), v.uuid()) }))
      .output(v.object({})),
  });

export default flowContract;
