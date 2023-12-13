import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../pages/Chat.css";
import { useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const Enter2Fa: React.FC<{}> = () => {
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token: string | undefined = Cookies.get("token");
    if (token !== undefined) {
      setToken(token);
    }
    if (!token) navigate("/Login");
  }, [navigate]);

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const authenticate = async (e: React.FormEvent) => {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_HOST}api/auth/2fa/authenticate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code }),
      }
    );
    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      Cookies.set("token", data.token);
      navigate("/Home");
    } else {
      toast.error(data.message[0], {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
    }
  };

  return (
    <>
      {loading ? (
        <>
          <FaIcons.FaSpinner className="spinner" />
        </>
      ) : (
        <></>
      )}
      <div className="inline-flex border-solid border-2 border-white h-fit w-6/12 lg:w-auto ring-offset-1 flex flex-col lg:self-start justify-between text-lg p-5">
        <h3>Authentification multi-facteurs</h3>
        <br />
        <p>
          Entrez le code fourni par votre application dans le champ ci-dessous,
          puis cliquez sur "Valider"
        </p>
        <input type="text" value={code} onChange={updateCode}></input>
        <br />
        <button
          className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={authenticate}
        >
          Valider
        </button>
      </div>
    </>
  );
};

export default Enter2Fa;
