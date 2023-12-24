import slugify from "react-slugify";

const createSlug = (str) => {
  const cleanedStr = str.replace(/[^a-zA-Z0-9\s]/g, "");
  const slug = slugify(cleanedStr, { replacement: "-", lower: true });
  return slug;
};

export const games = [
  {
    name: "The Last of Us Part II",
    score: 10,
    platform: "PS4",
    review: "Gayet Başarılı bir oyun",
    date: "22/02/2023",
    screenshoots: [
      {
        id: 1,
        url: "https://steamuserimages-a.akamaihd.net/ugc/2260307376237134981/0CDAFCCCF3F0A9A9834AD3A3E1B65B39DC9296B8/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      },
      {
        id: 2,
        url: "https://steamuserimages-a.akamaihd.net/ugc/2260307376237134981/0CDAFCCCF3F0A9A9834AD3A3E1B65B39DC9296B8/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true0",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1612834136517-0c3d0b1f5b1",
      },
    ],
  },
  {
    name: "Assassin's Creed Valhalla",
    score: 10,
    platform: "PS5",
    review: "Gayet Başarılı bir oyun",
    date: "22/02/2023",
    screenshoots: [
      {
        id: 1,
        url: "https://steamuserimages-a.akamaihd.net/ugc/2260307376237134981/0CDAFCCCF3F0A9A9834AD3A3E1B65B39DC9296B8/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      },
      {
        id: 2,
        url: "https://steamuserimages-a.akamaihd.net/ugc/2260307376237134981/0CDAFCCCF3F0A9A9834AD3A3E1B65B39DC9296B8/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true0",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1612834136517-0c3d0b1f5b1",
      },
    ],
  },
  {
    name: "Cyberpunk 2077",
    score: 9,
    platform: "Steam",
    review: "Harika oyun",
    date: "",
    photo:
      "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
    screenshoots: [
      {
        id: 1,
        url: "https://steamuserimages-a.akamaihd.net/ugc/2068898300035963342/ACED68C43247DD8349C1C190A6F3C147378909AC/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
        description: "Festival",
      },
      {
        id: 2,
        url: "https://steamuserimages-a.akamaihd.net/ugc/2068897413308237986/69A0717B5E7C0A1CE9D4A4EE63C799B2AEBE9EBB/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
        description: "",
      },
      {
        id: 3,
        url: "https://steamuserimages-a.akamaihd.net/ugc/2068898300035963738/77285F9CFA1A1EDB6F97912A1AEFB2F25DDA7616/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
        description: "Motorum şekil",
      },
    ],
  },
  {
    name: "Starfield",
    score: 10,
    platform: "PC",
    date: "22/02/2023",
    photo:
      "https://upload.wikimedia.org/wikipedia/en/6/6d/Bethesda_Starfield.jpg",
    review:
      "Gayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyunGayet Başarılı bir oyun",
    screenshoots: [],
  },
];
games.forEach((game) => {
  game.slug = createSlug(game.name);
});
