import jwt_decode from "jwt-decode";

export default function decodeToken(token: string): {username: string, user: number} {

	const payload: {username: string, user: number} = jwt_decode(token)
	return (payload);
}
