import React, { useEffect } from "react";
import { gsocket } from "../context/websocket.context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Logout from "../pages/LogOut";
import { useDispatch } from "react-redux";

const ForceLogout: React.FC<{}> = () => {
  const navigate = useNavigate();

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
