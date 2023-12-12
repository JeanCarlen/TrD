import React, { useEffect } from "react";
import { gsocket } from "../context/websocket.context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";

const ForceLogout: React.FC<{}> = () => {
  const navigate = useNavigate();
  const token: string | undefined = Cookies.get("token");
  let content: { username: string; user: number; avatar: string };

  useEffect(() => {
    if (token !== undefined) {
      content = decodeToken(token);
    } else
      content = {
        username: "default",
        user: 0,
        avatar: "http://localhost:8080/images/default.png",
      };
    if (content.username === "default") navigate("/login");
  }, []);

  useEffect(() => {
    gsocket.on("force-logout", () => {
      toast.error("You have been got logged somewhere else");

      Cookies.remove("token");
      gsocket.disconnect();
      navigate("/login");
    });
    return () => {
      gsocket.off("force-logout");
    };
  }, [gsocket]);

  return <></>;
};

export default ForceLogout;
