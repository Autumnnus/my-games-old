import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  userSettingsModal: false,
  ssModal: false,
  fullSSModal: false,
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
    togglefullSSModal: (state) => {
      state.fullSSModal = !state.fullSSModal;
    },
  },
});

export const {
  modalFunc,
  toggleUserSettingsModal,
  toggleSSModal,
  togglefullSSModal,
} = slice.actions;

export default slice.reducer;
