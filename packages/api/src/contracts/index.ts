import { oc } from '@orpc/contract';
import backofficeContract from './backoffice';
import diagramContract from './diagrams';
import docContract from './docs';
import flowContract from './flows';

export const appContract = oc
  .errors({
    INPUT_VALIDATION_FAILED: {
      status: 422,
    },
    UNAUTHORIZED: {
      status: 401,
      message: 'Missing user session. Please log in!',
    },
    FORBIDDEN: {
      status: 403,
      message: 'You do not have enough permission to perform this action.',
    },
  })
  .router({
    backoffice: backofficeContract,
    diagrams: diagramContract,
    docs: docContract,
    flows: flowContract,
  });
