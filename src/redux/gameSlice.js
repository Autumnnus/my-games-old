import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [],
};

const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    getGames: (state, action) => {
      state.games = action.payload;
    },
  },
});

export const { getGames } = gameSlice.actions;

export default gameSlice.reducer;
