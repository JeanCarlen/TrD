import React from 'react';
import { WebsocketContext, socket } from "../context/websocket.context"

const MatchmakingComponent: React.FC = () => {
  const handleSearchForGame = () => {
    socket.emit('searchForGame');
  };

  return (
    <div>
      <button onClick={handleSearchForGame}>Search for a Game</button>
    </div>
  );
};

export default MatchmakingComponent