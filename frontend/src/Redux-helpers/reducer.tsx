import React from "react";
import { combineReducers } from '@reduxjs/toolkit';
import decodeToken from '../helpers/helpers'
import Cookies from 'js-cookie'


const token: string|undefined = Cookies.get("token");
let content: {username: string, user: number};
if (token != undefined)
{
  content = decodeToken(token);
}
else
content = { username: 'default', user: 0};

const initialState = {
    userStatus: 0,
    username: content.username, 
  };

  const statusReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_USER_STATUS':
        return { ...state, userStatus: action.payload };
      default:
        return state;
    }
  };

  const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_USER_NAME':
        return { ...state, username: action.payload };
      default:
        return state;
    }
  };

  const rootReducer = (state = initialState, action: any) => {
    return {
      username: userReducer(state, action).username,
      userStatus: statusReducer(state, action).userStatus,
    };
  };
  export default rootReducer;
  