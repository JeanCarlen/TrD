import { createContext } from "react";
import { io, Socket } from 'socket.io-client'

export const socket = io('http://localhost:3001', { path: '/api', autoConnect: false });

export const WebsocketContext = createContext(socket);

export const WebsocketContextProvider = WebsocketContext.Provider;