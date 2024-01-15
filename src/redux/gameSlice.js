import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [],
  searchedGames: [],
};

const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    getGames: (state, action) => {
      state.games = action.payload;
    },
    getSearchedGames: (state, action) => {
      state.searchedGames = action.payload;
    },
  },
});

export const { getGames, getSearchedGames } = gameSlice.actions;

export default gameSlice.reducer;
