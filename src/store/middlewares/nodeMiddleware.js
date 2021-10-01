// import Axios from 'axios';
import nodeActions from '../actions/nodeActions';
import nodeApi from '../../api/api';

export default (store) => (next) => (action) => {
  const { dispatch } = store;

  switch (action.type) {
    case nodeActions.getNetwork.type:
      nodeApi
        .get('/info', {})
        .then(({ data: nodeData }) => {
          dispatch(nodeActions.setNetwork(nodeData.network));
        })
        .catch(() => {});

      break;

    default:
      break;
  }
  next(action);
};
