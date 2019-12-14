import { createSlice } from 'redux-starter-kit'

const initialState = {
  apiKey: '',
}

export default createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload
    },
  },
})
