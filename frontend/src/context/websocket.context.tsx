import { createContext } from "react";
import { io } from 'socket.io-client'

export const gsocket = io('http://10.12.2.5:8080', { path: '/api' });
// export const gsocket = io.connect()

export const WebsocketContext = createContext(gsocket);

export const WebsocketContextProvider = WebsocketContext.Provider;