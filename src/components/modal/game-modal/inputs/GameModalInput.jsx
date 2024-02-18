import PropTypes from "prop-types";
import { useState } from "react";
import { fetchRawgGameData } from "../../../../config/rawgConfig";

export const GameModalInput = ({ type, value, name, onchangeFunc, apiSearch }) => {
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  //   console.log(value[name], name);
  if (name === "name" && apiSearch === true) {
    const fetchAutocompleteData = async () => {
      const data = await fetchRawgGameData(value.name);
      setAutocompleteOptions(data.results);
    };

    const handleGameClick = (game) => {
      setSelectedGame(game);
      setAutocompleteOptions([]);
      onchangeFunc({
        target: {
          name: "name",
          value: game.name,
        },
      });
      onchangeFunc({
        target: {
          name: "gamePhoto",
          value: game.background_image,
        },
      });
      //   value.name = game.name;
      //   value.gamePhoto = game.background_image;
    };

    const handleButtonClick = () => {
      if (value.name.trim() !== "") {
        fetchAutocompleteData();
      } else {
        setAutocompleteOptions([]);
      }
    };

    return (
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Oyun İsmi xd (Zorunlu)"
          value={value[name]}
          name={name}
          id={name}
          onChange={(e) => onchangeFunc(e)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          required
        />
        <button className="p-2 bg-white rounded-lg text-sm flex items-center space-x-1" onClick={handleButtonClick}>
          <span>Ara</span>
        </button>
        {autocompleteOptions.length > 0 && (
          <ul className="absolute z-10 mt-12 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg">
            {autocompleteOptions.map((option) => (
              <li key={option.id} className="p-2 cursor-pointer" onClick={() => handleGameClick(option)}>
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return (
    <input
      type={type}
      name={name}
      id={name}
      value={value[name]}
      placeholder="Oyun İsmi (Zorunlu)"
      onChange={(e) => onchangeFunc(e)}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      required
    />
  );
};

GameModalInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onchangeFunc: PropTypes.func.isRequired,
  apiSearch: PropTypes.bool.isRequired,
};
