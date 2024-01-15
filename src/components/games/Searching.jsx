import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSearchedGames } from "../../redux/gameSlice";
import { useLocation, useNavigate } from "react-router-dom";

const Searching = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search");
  const [search, setSearch] = useState(decodeURIComponent(searchParam));
  const [submitCount, setSubmitCount] = useState(0);
  const games = useSelector((state) => state.games.games);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitCount((prevCount) => prevCount + 1);
  };

  const triggerEffect = () => {
    let gameArray = [];
    if (search !== undefined && search !== null && search !== "") {
      games.filter((game) => {
        game.gameName.toLowerCase().includes(search.trim().toLowerCase()) ? gameArray.push(game) : null;
      });
      dispatch(getSearchedGames(gameArray));
      navigate(`?search=${search}`);
    }
  };

  useEffect(() => {
    search !== "null" && triggerEffect();
  }, [submitCount]);

  return (
    <form className="w-96" onSubmit={handleSubmit}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Oyun Ara"
          onChange={handleSearch}
          required
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Ara
        </button>
      </div>
    </form>
  );
};

export default Searching;
