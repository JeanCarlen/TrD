import jwt_decode from "jwt-decode";

export default function decodeToken(token: string): JWTPayload {
  const payload: JWTPayload = jwt_decode(token);
  return payload;
}