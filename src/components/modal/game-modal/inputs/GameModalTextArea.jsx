import PropTypes from "prop-types";

export const GameModalTextArea = ({ name, value, onchangeFunc }) => {
  return (
    <textarea
      id={name}
      name={name}
      value={value[name]}
      onChange={(e) => onchangeFunc(e)}
      rows={4}
      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Oyun İncelemenizi Buraya Yazınız (İsteğe Bağlı)"
    ></textarea>
  );
};

GameModalTextArea.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onchangeFunc: PropTypes.func.isRequired,
};
