import React from 'react';
import { useSelector } from 'react-redux';

interface RootState {
  userStatus: number;
}

const MyStatus: React.FC<{}> = () => {
  const userStatus = useSelector((state: RootState) => state.userStatus);
  let color;

  switch (userStatus) {
    case 2:
      color = 'orange';
      break;
    case 1:
      color = 'green';
      break;
    case 0:
      color = 'gray';
      break;
    default:
      color = 'black';
  }

  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: color,
      }}
    ></div>
  );
};

export default MyStatus;

