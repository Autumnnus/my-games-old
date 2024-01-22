import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { togglefullSSModal } from "../../redux/modalSlice";
import PropTypes from "prop-types";

const ImageModal = ({ imgModalUrl, imgModalName }) => {
  ImageModal.propTypes = {
    imgModalUrl: PropTypes.string.isRequired,
    imgModalName: PropTypes.string.isRequired,
  };
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(togglefullSSModal());
  };
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center md:items-start justify-center overflow-auto bg-black bg-opacity-80">
      <div className="w-full shadow-lg rounded-md p-4">
        <div className="py-3 flex items-center bg-black/50 rounded-t-md p-2">
          <div className="flex items-center space-x-5 flex-grow">
            <p className="flex-grow text-white">{imgModalName}</p>
            <IoIosClose
              className="cursor-pointer bg-gray-600 rounded-full text-white hover:bg-red-700"
              size={24}
              onClick={closeModal}
            ></IoIosClose>
          </div>
        </div>
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-black">
              <img src={imgModalUrl} alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
