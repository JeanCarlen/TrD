import Game from "./pages/LetsPlay";
import Chat from "./chat/Chat";
import Stats from "./pages/Stats";
import Home from "./pages/Home";
import Logout from "./pages/LogOut";
import Profiles from "./Social/Profiles";
import { Socket } from "socket.io-client";
import { Routes as Router, Route, Navigate, Outlet } from "react-router-dom";
import RegisterButton from "./LoginForm/RegisterButton";
import Cookies from "js-cookie";
import decodeToken from "./helpers/helpers";
import MFASetup from "./pages/mfasetup";
import Enter2Fa from "./Components/Enter2Fa";
import AchTest from "./pages/AchievementTest";
import { setUserStatus } from "./Redux-helpers/action";
import { useDispatch } from "react-redux";
import { gsocket } from "./context/websocket.context";
export let globalSocket: Socket;

type Props = {};

const PrivateRoutes = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  let tokenContent;
  if (token) {
    tokenContent = decodeToken(token);
  } else {
    // content = decodeToken(isToken);
    return <Outlet />;
  }

  if (!token) return <Navigate to="/login" replace />;
  else if (token && tokenContent && tokenContent.twofacodereq)
    return <Navigate to="/authenticate" replace />;
  else {
    gsocket.connect();
    gsocket.emit("connect_id", tokenContent.user);
    console.log(
      "WebSocket initialised: ",
      gsocket.id,
      "token content",
      tokenContent.user
    );
    dispatch(setUserStatus(1));
    // globalSocket.emit('userSend', tokenContent.user);
    return <Outlet />;
  }
};

const Routes: React.FC = (props: Props) => {
  return (
    <div className="loginTest">
      <Router>
        <Route path="/login" element={<RegisterButton />} />
        <Route path="/authenticate" element={<Enter2Fa />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/Home" element={<Home />} />
          {/* <Route path="/users" element={<Users />} /> */}
          <Route path="/game" element={<Game />} />
          <Route path="/chats" Component={Chat} />
          {/* element={<Chat />} /> */}
          <Route path="/statistics" element={<Stats />} />
          {/* <Route path="/profiles" element={<Profiles />} /> */}
          <Route path="/profiles/:users" element={<Profiles />} />
          {/* <Route path="/profile" element={<Profiles />} /> */}
          <Route path="/Logout" element={<Logout />} />
          <Route path="/mfasetup" element={<MFASetup />} />
          <Route path="/achi" element={<AchTest />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Router>
    </div>
  );
};

export default Routes;
