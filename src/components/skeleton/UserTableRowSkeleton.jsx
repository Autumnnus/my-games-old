/* eslint-disable react/prop-types */
const SkeletonCell = ({ width, height }) => (
  <td className="px-0 py-0 lg:px-4 lg:py-4">
    <div style={{ width, height }} className="bg-gray-300 animate-pulse rounded-full"></div>
  </td>
);

const SkeletonHeaderCell = ({ width, height }) => (
  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    <div style={{ width, height }} className="bg-gray-300 animate-pulse"></div>
  </th>
);

const UserTableRowSkeleton = ({ rowCount }) => {
  const rows = Array.from({ length: rowCount }, (_, index) => (
    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <SkeletonCell width="4rem" height="4rem" />
      <SkeletonHeaderCell width="8rem" height="1.5rem" />
      <SkeletonHeaderCell width="4rem" height="1.5rem" />
      <SkeletonHeaderCell width="4rem" height="1.5rem" />
      <SkeletonHeaderCell width="4rem" height="1.5rem" />
    </tr>
  ));

  return <>{rows}</>;
};

export default UserTableRowSkeleton;
