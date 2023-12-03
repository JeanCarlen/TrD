import "./App.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Routes from "./PrivateRoute";
import { Provider } from "react-redux";
import store from "./Redux-helpers/store";
import { WebsocketContextProvider, gsocket } from "./context/websocket.context";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <div className="text-center w-full h-full p-4 overflow-auto min-h-screen bg-center bg-cover box-border relative h-14 bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <Provider store={store}>
        <WebsocketContextProvider value={gsocket}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </WebsocketContextProvider>
        <ToastContainer />
      </Provider>
    </div>
  );
}

export default App;
