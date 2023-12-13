import React, { useEffect } from "react";
import { gsocket } from "../context/websocket.context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../pages/Stats";

const GameInvite: React.FC<{}> = () => {
  const navigate = useNavigate();

  const ToastMessage = (data: { inviter: User; roomName: string }) => (
    <div>
      INVITED by {data.inviter?.username}
      <button
        className="sendButton"
        onClick={() => replyMatch(data.roomName, "accept")}
      >
        OK
      </button>
      <button
        className="sendButton"
        onClick={() => replyMatch(data.roomName, "refuse")}
      >
        NO
      </button>
    </div>
  );

  function replyMatch(roomName: string, status: string) {
    gsocket.emit("replyInvite", { roomName: roomName, status: status });
    if (status === "accept") {
      navigate("/game");
    }
  }

  useEffect(() => {
    gsocket.on("invite", (dataBack: { inviter: User; roomName: string }) => {
      toast.info(
        <ToastMessage
          inviter={dataBack.inviter}
          roomName={dataBack.roomName}
        />,
        { position: toast.POSITION.BOTTOM_LEFT, className: "toast-info" }
      );
    });

    return () => {
      gsocket.off("invite");
    };
  }, [gsocket]);

  return null;
};

export default GameInvite;
