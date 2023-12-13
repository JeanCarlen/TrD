import { createContext } from "react";
import { io } from 'socket.io-client'

export const gsocket = io('wss://trd.laendrun.ch:3000', { path: '/api' });

export const WebsocketContext = createContext(gsocket);

export const WebsocketContextProvider = WebsocketContext.Provider;