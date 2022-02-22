import { StrictDict } from '../../utils';

export const ReqeustKeys = StrictDict({
  fetchBlock: 'fetchBlock',
  fetchUnit: 'fetchUnit',
  saveBlock: 'saveBlock',
});

export const RequestStates = StrictDict({
  inactive: 'inactive',
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
});

export const RequestKeys = StrictDict({
  fetchBlock: 'fetchBlock',
  fetchUnit: 'fetchUnit',
  saveBlock: 'saveBlock',
});