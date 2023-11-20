// import { io, Socket } from 'socket.io-client';
// import { setOtherUserStatus } from '../Redux-helpers/userStatusSlice';
// import store from '../Redux-helpers/store';
// import { socket, WebsocketContext } from "../context/websocket.context";
// import React, { useState, useContext, useEffect, useRef } from "react";


// export const updateFriendStatus = (userId: string, status: string) => {
//   // Update the friend status locally
//   store.dispatch(setOtherUserStatus({ userId, status }));

//   // Emit a socket event to update the friend status on the server
//   socket.emit('updateFriendStatus', { userId, status });
// };


