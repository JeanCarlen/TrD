export {};

declare global {

  type JWTPayload = {
	user: number,
	username: string,
	avatar: string,
	twofaenabled?: boolean,
  };
}
