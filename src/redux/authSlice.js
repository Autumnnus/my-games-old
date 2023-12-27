import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: "",
  token: localStorage.getItem("my-game-user") || "",
  loginMode: true,
  users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authInfo: (state, action) => {
      state.auth = action.payload;
    },
    tokenInfo: (state, action) => {
      if (localStorage.getItem("my-game-user")) {
        state.token = "";
        localStorage.removeItem("my-game-user");
      } else {
        localStorage.setItem("my-game-user", action.payload);
        const logedUserParse = localStorage.getItem("my-game-user");
        state.loggedUser = JSON.parse(logedUserParse);
      }
    },
    loginFunc: (state, action) => {
      if (!localStorage.getItem("my-game-user")) {
        localStorage.setItem("my-game-user", action.payload);
        const logedUserParse = localStorage.getItem("my-game-user");
        state.loggedUser = JSON.parse(logedUserParse);
      }
    },
    logoutFunc: (state) => {
      state.token = "";
      localStorage.removeItem("my-game-user");
    },
    toggleLoginMode: (state) => {
      state.loginMode = !state.loginMode;
    },

    fetchUsersFromDB: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { authInfo, loginFunc, logoutFunc, toggleLoginMode, fetchUsersFromDB } = authSlice.actions;

export default authSlice.reducer;
