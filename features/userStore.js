import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const counterSlice = createSlice({
  name: "userStore",
  initialState,
  reducers: {
    addInfoUser: (state, action) => {
      return action.payload;
    },
    changeInfo: (state, action) => {
      return { ...state, tikado: action.payload };
    },
  },
});

export const { addInfoUser, changeInfo } = counterSlice.actions;

export default counterSlice.reducer;
