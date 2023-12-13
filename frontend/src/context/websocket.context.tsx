import { createContext } from "react";
import { io } from 'socket.io-client'

export const gsocket = io('https://trd.laendrun.ch', { path: '/api' });

export const WebsocketContext = createContext(gsocket);

export const WebsocketContextProvider = WebsocketContext.Provider;