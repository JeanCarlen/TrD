export {};

declare global {
    type FriendData = {
        id: number,
        requester: number,
        requested: number,
        status: number,
        name: string,
    }
}
