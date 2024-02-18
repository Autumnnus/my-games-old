import axios from "axios";

export const fetchRawgGameData = async (gameName) => {
  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: import.meta.env.VITE_RAWG_API_KEY,
        search: gameName,
      },
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export async function fetchIGDBGameData() {
  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games?search=zelda&fields=name,slug,genres.name,cover.url,cover.image_id,game_modes.name,genres.name",
      {},
      {
        headers: {
          Accept: "application/json",
          "Client-ID": "l4pr55lt0ezaizlm7ug9sat0s5zorp",
          Authorization: "Bearer au00iq1ar4ykjak6pm4gd6yd8n5a6i",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
  // try {
  //   const response = await axios.post(
  //     "http://localhost:8080/https://api.igdb.com/v4/games?search=zelda&fields=name,slug,genres.name,cover.url,cover.image_id,game_modes.name,genres.name",
  //     {},
  //     {
  //       headers: {
  //         Accept: "application/json",
  //         "Client-ID": "l4pr55lt0ezaizlm7ug9sat0s5zorp",
  //         Authorization: "Bearer au00iq1ar4ykjak6pm4gd6yd8n5a6i",
  //       },
  //     }
  //   );
  //   console.log(response.data);
  //   return response.data;
  // } catch (err) {
  //   console.error(err);
  //   throw err;
  // }
}
