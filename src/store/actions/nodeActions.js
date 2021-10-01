import { createAction } from 'redux-starter-kit';
import nodeSlice from '../slices/nodeSlice';

const getNetwork = createAction('getNetwork');

export default {
  ...nodeSlice.actions,
  getNetwork,
};
