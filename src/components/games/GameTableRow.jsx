import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import logo from "../../assets/logo.png";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

const GameTableRow = ({ game, userPathId, token, index, hoveredRow, setHoveredRow, editGameInfo }) => {
  GameTableRow.propTypes = {
    game: PropTypes.object.isRequired,
    userPathId: PropTypes.string.isRequired,
    token: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
    hoveredRow: PropTypes.number,
    setHoveredRow: PropTypes.func,
    editGameInfo: PropTypes.func.isRequired,
  };
  return (
    <tr
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      onMouseEnter={() => setHoveredRow(index)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      <td className="px-0 py-0 lg:px-4 lg:py-4">
        <Link to={`/user/${userPathId}/game/${game.id}`}>
          {game.gamePhoto === "" ? (
            <img
              src={logo}
              data-tooltip-id="my-tooltip"
              data-tooltip-html={
                game.gameReview
                  ? `<div><h3>${game.gameName} İncelemesi</h3><p class="max-w-96">${game.gameReview}</p></div>`
                  : null
              }
              className="object-contain w-16 h-16 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out"
            />
          ) : (
            <img
              src={game.gamePhoto}
              data-tooltip-id="my-tooltip"
              data-tooltip-html={
                game.gameReview
                  ? `<div><h3 class="text-center text-md mb-2">${game.gameName} İncelemesi</h3><p class="max-w-96">${game.gameReview}</p></div>`
                  : `<div><h3 class="text-center text-md mb-2">${game.gameName} İncelemesi bulunmamaktadır.</h3></div>`
              }
              alt="Geçersiz Fotoğraf Url"
              className="object-cover w-16 h-16 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out"
            />
          )}
        </Link>
      </td>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <Link to={`/user/${userPathId}/game/${game.id}`} className="hover:text-sky-800 duration-150 cursor-pointer">
          {game.gameName}
        </Link>
      </th>
      <td
        className={`px-6 py-4 ${
          game.gameScore === 10
            ? "text-blue-500"
            : game.gameScore >= 9
            ? "text-sky-300"
            : game.gameScore >= 8
            ? "text-green-700"
            : game.gameScore >= 7
            ? "text-green-500"
            : game.gameScore >= 6
            ? "text-green-300"
            : game.gameScore >= 5
            ? "text-green-100"
            : game.gameScore >= 4
            ? "text-yellow-300"
            : game.gameScore >= 3
            ? "text-yellow-500"
            : game.gameScore >= 2
            ? "text-rose-300"
            : game.gameScore >= 1
            ? "text-rose-500"
            : "text-rose-700"
        }`}
      >
        {game.gameScore}/10
      </td>
      <td className="px-6 py-4">{game.gamePlatform}</td>
      <td className="px-6 py-4">{game.screenshots ? game.screenshots.length : "0"}</td>
      <td className="px-6 py-4">{game.gameTotalTime ? game.gameTotalTime : "-"}</td>
      <td className="px-6 py-4">{game.gameDate ? game.gameDate : "-"}</td>
      <td
        className={`px-6 py-4 relative ${
          game.gameStatus === "Bitirildi"
            ? "text-green-600"
            : game.gameStatus === "Bitirilecek"
            ? "text-yellow-300"
            : game.gameStatus === "Aktif Oynanılıyor"
            ? "text-sky-500"
            : game.gameStatus === "Bırakıldı"
            ? "text-red-800"
            : "text-gray-500"
        }`}
      >
        {game.gameStatus}{" "}
        {token && JSON.parse(token).uid === userPathId && (
          <FaPen
            className={`absolute top-3 right-3 cursor-pointer transition-opacity duration-300 text-gray-500 ${
              hoveredRow === index ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => editGameInfo(index)}
          ></FaPen>
        )}
        <Tooltip id="my-tooltip" />
      </td>
    </tr>
  );
};

export default GameTableRow;
