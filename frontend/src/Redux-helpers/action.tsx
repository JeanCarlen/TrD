import React from "react";

export const setUserStatus = (status: string) => {
    return {
      type: 'SET_USER_STATUS',
      payload: status,
    };
  };

export const setUserName = (username: string) => {
  return {
    type: 'SET_USER_NAME',
    payload: username,
  };
};
  