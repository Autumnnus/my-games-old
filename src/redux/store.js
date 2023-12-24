import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalSlice";
import authSlice from "./authSlice";
import gameSlice from "./gameSlice";

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    auth: authSlice,
    games: gameSlice,
  },
});
