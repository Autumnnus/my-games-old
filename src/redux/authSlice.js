import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: "",
  token: localStorage.getItem("my-game-user") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authInfo: (state, action) => {
      state.auth = action.payload;
      console.log(state.auth);
    },
    tokenInfo: (state, action) => {
      if (localStorage.getItem("my-game-user")) {
        state.token = "";
        localStorage.removeItem("my-game-user");
      } else {
        localStorage.setItem("my-game-user", action.payload);
        const logedUserParse = localStorage.getItem("my-game-user");
        state.loggedUser = JSON.parse(logedUserParse);
        console.log(state.loggedUser);
      }
    },
    loginFunc: (state, action) => {
      if (!localStorage.getItem("my-game-user")) {
        localStorage.setItem("my-game-user", action.payload);
        const logedUserParse = localStorage.getItem("my-game-user");
        state.loggedUser = JSON.parse(logedUserParse);
        console.log(state.loggedUser);
      }
    },
    logoutFunc: (state) => {
      state.token = "";
      localStorage.removeItem("my-game-user");
      console.log("çıkış yapıldı");
    },
  },
});

export const { authInfo, loginFunc, logoutFunc } = authSlice.actions;

export default authSlice.reducer;
