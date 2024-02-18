import PropTypes from "prop-types";

export const GameModalSelect = ({ value, name, onchangeFunc, options }) => {
  return (
    <select
      id={name}
      name={name}
      onChange={(e) => onchangeFunc(e)}
      value={value[name]}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

GameModalSelect.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onchangeFunc: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};
