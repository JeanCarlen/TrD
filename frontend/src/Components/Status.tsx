import React from 'react';
import { useSelector } from 'react-redux';
import { setUserStatus } from '../Redux-helpers/action';

const ShowStatus: React.FC = () => {
  const userStatus = useSelector((state: string) => state.userStatus);
  let color;

  switch (userStatus) {
    case 'in-game':
      color = 'orange';
      break;
    case 'Online':
      color = 'green';
      break;
    case 'Offline':
      color = 'red';
      break;
    default:
      color = 'gray';
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

export default ShowStatus;
