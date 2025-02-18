import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: null,
  isLoading: false,
  error: null,
};

const textSlice = createSlice({
  name: 'temp',
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setText, setLoading, setError } = textSlice.actions;

export default textSlice.reducer;
