import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toggleSSModal } from "../../redux/modalSlice";
const WarningModal = ({ deleteFromFirestore, setToggleWarningModal, deleteSSFromFirestore }) => {
  WarningModal.propTypes = {
    deleteFromFirestore: PropTypes.func.isRequired,
    deleteSSFromFirestore: PropTypes.func.isRequired,
    setToggleWarningModal: PropTypes.bool.isRequired,
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchKey = location.search.split("?")[1].split("=")[0];
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
      <div className="relative p-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Oyunu silmek istediğine emin misin?</h3>
          </div>
          {/* Modal body */}

          <div className="p-4 md:p-5">
            <div className="grid gap-2 mb-4 grid-cols-2">
              <button
                type="submit"
                className="text-white inline-flex items-center bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800"
                onClick={deleteFunc}
              >
                Evet
              </button>

              <button
                type="submit"
                className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-700"
                onClick={() => setToggleWarningModal(false)}
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
