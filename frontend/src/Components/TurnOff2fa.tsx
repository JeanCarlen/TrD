
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const TurnOff2fa: React.FC<{}> = () => {
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const token: string | undefined = Cookies.get("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const turnOff = async (e: React.FormEvent) => {
    const response = await fetch("http://localhost:8080/api/auth/2fa", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: code }),
    });
    const data = await response.json();
    Cookies.set("token", data.token);
    toast.success(data.message[0], {
      position: toast.POSITION.BOTTOM_LEFT,
      className: "toast-success",
    });
  };

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  return (
    <>
      <div>
        <input
          className="inline w-content placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          placeholder="input your QR code here"
          type="text"
          name="search"
          onChange={updateCode}
          value={code}
        ></input>
        <br />
        <button
          className="border-slate-100 bg-cyan-50 hover:bg-cyan-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={turnOff}
        >
          Désactiver
        </button>
      </div>
    </>
  );
};

export default TurnOff2fa;
