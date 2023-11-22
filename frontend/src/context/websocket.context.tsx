import { createContext } from "react";
import { io, Socket } from 'socket.io-client'

export const gsocket = io('http://localhost:3001', { path: '/api', autoConnect: false });

export const WebsocketContext = createContext(gsocket);

export const WebsocketContextProvider = WebsocketContext.Provider;