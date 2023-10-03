export {};

declare global {
    type FriendData = {
        id: number,
        requester: number,
        requested: number,
        status: number,
        name: string,
    }
  type JWTPayload = {
	user: number,
	username: string,
	avatar: string,
	twofaenabled: boolean,
	twofacodereq: boolean
  };
}
