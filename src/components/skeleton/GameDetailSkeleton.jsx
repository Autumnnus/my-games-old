import CircleRightComp from "../CircleRightComp";

const GameDetailSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row text-white mt-10">
      <div className="flex-shrink-0 md:w-1/4">
        <div className="w-80 h-80 bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
      <div className="lg:flex flex-col justify-center px-4 lg:ml-8 lg:w-full mt-4 lg:mt-0">
        <div className="lg:flex justify-between items-center mb-3">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <div className="w-96 h-12 bg-gray-300 animate-pulse"></div>
          </h2>
          <div className="flex space-x-4">
            <div className="w-36 h-16 bg-gray-300 animate-pulse"></div>
            <div className="w-36 h-16 bg-gray-300 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-3">
          <p className="mr-4 flex items-center space-x-2">
            <div className="font-bold">Platform: </div>
            <div className="w-16 h-5 bg-gray-300 animate-pulse" />
          </p>
          <p className="mr-4 flex items-center space-x-2">
            <span className="font-bold">Puan: </span>
            <div className="w-14 h-5 bg-gray-300 animate-pulse" />
          </p>
          <p className="mr-4 flex items-center space-x-2">
            <span className="font-bold">Oyun durumu: </span>
            <div className="w-20 h-5 bg-gray-300 animate-pulse" />
          </p>
          <p className="mr-4 flex items-center space-x-2">
            <span className="font-bold">Toplam Oynama Saati: </span>
            <div className="w-10 h-5 bg-gray-300 animate-pulse" />
          </p>
          <p className="mr-4 flex items-center space-x-2">
            <span className="font-bold">Son Oynama Tarihi: </span>
            <div className="w-28 h-5 bg-gray-300 animate-pulse" />
          </p>
          <p className="flex items-center space-x-2">
            <span className="font-bold">İnceleme: </span>
            <div className="w-full h-5 bg-gray-300 animate-pulse" />
          </p>
          <div className="w-full h-5 bg-gray-300 animate-pulse" />
          <div className="w-full h-5 bg-gray-300 animate-pulse" />
          <div className="w-full h-5 bg-gray-300 animate-pulse" />
          <div className="w-full h-5 bg-gray-300 animate-pulse" />
        </div>
        <div className="absolute top-0 right-0 z-[-1] opacity-30 lg:opacity-100">
          <CircleRightComp />
          <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailSkeleton;
