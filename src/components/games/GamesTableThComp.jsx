import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import PropTypes from "prop-types";

const GamesTableThComp = ({ filterDatas, filterValue, elementInfo }) => {
  GamesTableThComp.propTypes = {
    filterDatas: PropTypes.func.isRequired,
    filterValue: PropTypes.string.isRequired,
    elementInfo: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
  };
  return (
    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={(e) => filterDatas(e)}>
      <span className="flex items-center space-x-10">
        {elementInfo.name}
        {filterValue === elementInfo.value ? (
          <FaSortDown size={15} />
        ) : filterValue === `-${elementInfo.value}` ? (
          <FaSortUp size={15} />
        ) : (
          <FaSort size={15} />
        )}
      </span>
    </th>
  );
};

export default GamesTableThComp;
