import { createSlice } from "@reduxjs/toolkit";

const initialState = { modal: false };

const slice = createSlice({
  name: "modelslice",
  initialState,
  reducers: {
    modalFunc: (state) => {
      state.modal = !state.modal;
    },
  },
});

export const { modalFunc } = slice.actions;

export default slice.reducer;
