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
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center overflow-auto">
      <div className="w-full bg-white shadow-lg rounded-md p-4">
        <div className="border-b py-3 flex items-center">
          <div className="flex items-center space-x-5 flex-grow">
            <p className="flex-grow">{imgModalName}</p>
            <IoIosClose
              className="cursor-pointer bg-red-600 rounded-full text-white hover:bg-red-700"
              size={24}
              onClick={closeModal}
            ></IoIosClose>
          </div>
        </div>
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <img
            src={imgModalUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
