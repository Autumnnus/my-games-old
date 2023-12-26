import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toggleSSModal } from "../../redux/modalSlice";
const WarningModal = ({
  deleteFromFirestore,
  setToggleWarningModal,
  deleteSSFromFirestore,
}) => {
  WarningModal.propTypes = {
    deleteFromFirestore: PropTypes.func.isRequired,
    deleteSSFromFirestore: PropTypes.func.isRequired,
    setToggleWarningModal: PropTypes.bool.isRequired,
  };

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchKey = location.search.split("?")[1].split("=")[0];
  console.log(searchKey);
  const deleteFunc = () => {
    if (searchKey === "editSS") {
      deleteSSFromFirestore();
      setToggleWarningModal(false);
      dispatch(toggleSSModal());
      navigate(location.pathname);
    } else {
      deleteFromFirestore();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center">
      <div className="w-1/3 bg-white shadow-lg rounded-md p-4">
        <h1>Oyunu silmek istediğine emin misin?</h1>
        <button
          className="w-full h-10 bg-indigo-600 text-white flex items-center justify-center mt-2 rounded-md border-none"
          onClick={deleteFunc}
        >
          Evet
        </button>
        <button
          className="w-full h-10 bg-indigo-600 text-white flex items-center justify-center mt-2 rounded-md border-none"
          onClick={() => setToggleWarningModal(false)}
        >
          Hayır
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
