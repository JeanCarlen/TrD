import React from "react";
import { useState } from "react";
import "../pages/Chat.css";

interface User {
  id: string;
  name: string;
}

interface Authresponse {
  token: string;
  user: User;
}

const Auth2F: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const onSuccess = async (rep: any) => {
    const response = await fetch(
      "http://localhost:8080/api/auth/otp/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: rep?.tokenId }),
      }
    );

    if (response.ok) {
      const result: Authresponse = await response.json();
      setUser(user);
    } else {
    }
  };
  return (
    <div>
      <button className="sendButton">Google Sign-In Example</button>
    </div>
  );
};

export default Auth2F;
