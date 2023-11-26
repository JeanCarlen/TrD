import React from 'react';
import { useSelector } from 'react-redux';
import { setUserStatus } from '../Redux-helpers/action';

interface statusProps {
  status: number;
}

const ShowStatus: React.FC<statusProps> = ({status}) => {
  let color;

  switch (status) {
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
    console.log("friends' status", status);
  }


  return (
    <div
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: color,
      }}
    ></div>
  );
};

export default ShowStatus;
