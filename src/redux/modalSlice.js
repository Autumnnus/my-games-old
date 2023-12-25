import { createSlice } from "@reduxjs/toolkit";

const initialState = { modal: false, userSettingsModal: false };

const slice = createSlice({
  name: "modelslice",
  initialState,
  reducers: {
    modalFunc: (state) => {
      state.modal = !state.modal;
    },
    toggleUserSettingsModal: (state) => {
      state.userSettingsModal = !state.userSettingsModal;
    },
  },
});

export const { modalFunc, toggleUserSettingsModal } = slice.actions;

export default slice.reducer;
