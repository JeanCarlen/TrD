import jwt_decode from "jwt-decode";

export default function decodeToken(token: string): {username: string, user: number, avatar: string} {

	const payload: {username: string, user: number, avatar: string} = jwt_decode(token)
	return (payload);
}
