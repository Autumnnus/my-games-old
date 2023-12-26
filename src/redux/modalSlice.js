import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  userSettingsModal: false,
  ssModal: false,
};

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
    toggleSSModal: (state) => {
      state.ssModal = !state.ssModal;
    },
  },
});

export const { modalFunc, toggleUserSettingsModal, toggleSSModal } =
  slice.actions;

export default slice.reducer;
