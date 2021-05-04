import { User } from "../types/user";

export class Room {
    public roomId: string
    public users: User[]
    public available: boolean

    constructor(roomId: string) {
        this.roomId = roomId
    }
}