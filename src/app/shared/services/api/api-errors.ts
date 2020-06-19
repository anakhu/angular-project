import { ApiErrors } from '../../models/api/apiErrors';

export const API_ERRORS: ApiErrors = {
  add: {
    code: 'api/update-failed',
    message: 'Updates were not applied',
  },
  update: {
    code: 'api/update-failed',
    message: 'Updates were not applied',
  },
  push: {
    code: 'api/push-failed',
    message: 'Operation failed an entry due to an error',
  },
  delete: {
    code: 'api/delete-failed',
    message: 'Failed to delete the entry due to an error',
  }
};
