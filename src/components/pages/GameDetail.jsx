import { useLocation } from "react-router-dom";
import { games } from "../../utils/games";

const GameDetail = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2].split("-").join(" ");
  const findGame = games.find(
    (game) => game.name.toLowerCase().split("'").join("") === path
  );

  console.log(games[0]);
  console.log(findGame);
  if (!findGame) {
    return <div>Game not found</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="flex items-center">
        <div className="">
          <img
            src={findGame.photo}
            alt={findGame.name}
            className="rounded-lg object-cover h-full"
          />
        </div>
        <div className="px-8">
          <h2 className="text-4xl font-bold mb-4">{findGame.name}</h2>
          <p className="text-gray-700 mb-6">
            <span className="font-bold">İnceleme: </span>
            {findGame.review}
          </p>
          <div className="flex items-center text-gray-700">
            <span className="mr-4">
              {" "}
              <span className="font-bold">Platform: </span> {findGame.platform}
            </span>
            <span>
              {" "}
              <span className="font-bold">Score: </span> {findGame.score}/10
            </span>
          </div>
        </div>
      </div>

      {findGame.screenshoots && findGame.screenshoots.length > 1 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Screenshots</h3>
          <div className="grid grid-cols-3 gap-4">
            {findGame.screenshoots.map((screenshot) => (
              <div key={screenshot.id} className="relative mb-4">
                <img
                  src={screenshot.url}
                  alt={`Screenshot ${screenshot.id}`}
                  className="rounded-lg"
                />
                {screenshot.description && (
                  <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    {screenshot.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetail;
