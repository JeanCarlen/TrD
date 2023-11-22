import React from "react";
import { combineReducers } from '@reduxjs/toolkit';

const initialState = {
    userStatus: 'Offline',
  };
  
  const rootReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_USER_STATUS':
        return { ...state, userStatus: action.payload };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  