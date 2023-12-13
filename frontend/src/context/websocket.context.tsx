import { createContext } from "react";
import { io } from "socket.io-client";

export const gsocket = io(`http://${process.env.REACT_APP_IP}:3001`, {
  path: "/api",
  autoConnect: false,
});

export const WebsocketContext = createContext(gsocket);

export const WebsocketContextProvider = WebsocketContext.Provider;
