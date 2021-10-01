import { createSlice } from 'redux-starter-kit';

const initialState = {
  network: 'mainnet',
};

export default createSlice({
  name: 'nodeSlice',
  initialState,
  reducers: {
    setNetwork: (state, { payload }) => {
      state.network = payload;
    },
  },
});
