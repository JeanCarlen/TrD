import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const TurnOn2fa: React.FC<{}> = () => {
  const [active, setActive] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    const token: string | undefined = Cookies.get("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const activate = async (e: React.FormEvent) => {
    setActive(true);
    const response = await fetch(
      `${process.env.REACT_APP_HOST}api/auth/2fa/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.text();
    setQrCode(data);
  };

  const turnOn = async (e: React.FormEvent) => {
    if (code === "") {
      toast.error("Code cannot be empty.", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_HOST}api/auth/2fa/turn-on`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: code }),
    });
    const data = await response.json();
    if (response.ok) {
      Cookies.set("token", data.token);
      toast.success(data.message[0], {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-success",
      });
    }
  };

  const cancel = (e: React.FormEvent) => {
    setActive(false);
  };

  return (
    <>
      {active ? (
        <div>
          <img
            className="box-content h-64 w-64 inline"
            src={qrCode}
            alt="MFA Google Authenticator Configuration QR CODE"
          />
          <div>
            <br />
            <input
              className="inline w-content placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="input your QR code here"
              type="text"
              name="search"
              onChange={updateCode}
              value={code}
            ></input>
            <br />
          </div>
          <div className="inline-flex w-content">
            <button
              className="border-slate-100 bg-cyan-50 hover:bg-cyan-500 text-black font-bold py-2 px-4 rounded mb-4"
              onClick={turnOn}
            >
              Activer
            </button>
            <button
              className="border-slate-100 bg-cyan-50 hover:bg-cyan-500 text-black font-bold py-2 px-4 rounded mb-4"
              onClick={cancel}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            className="border-slate-100 bg-cyan-50 hover:bg-cyan-500 text-black font-bold py-2 px-4 rounded mb-4"
            onClick={activate}
          >
            Turn On 2FA
          </button>
        </div>
      )}
    </>
  );
};

export default TurnOn2fa;
