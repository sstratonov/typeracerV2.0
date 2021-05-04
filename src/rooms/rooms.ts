import { Room, User } from "../types";

const maxInRoom = 2

export class Rooms {
  public rooms: Room[]

  public createIfNeeded(roomId: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if(this.rooms[i].roomId == roomId) {
        return this.rooms[i].roomId
      }
    }
    const newRoom = new Room(roomId)
    this.rooms.push(newRoom)
    return newRoom.roomId
  }

  public addUser(user: User, roomId: string) {
    for(let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId === roomId) {
        this.rooms[i].users.push(user)
        return 
      }
    }
    throw new Error(`There is no room with ${roomId} id.`)
  }

  public checkIfFull(roomId: string) {
    let isFull = false
    for (let i = 0; i < this.rooms.length; i++) {
      if (
        this.rooms[i].available &&
        this.rooms[i].users.length === maxInRoom
      ) {
        this.rooms[i].available = false
        isFull = true
      }
    }
    return isFull
  }
}



// import SocketIO from "socket.io";
// import { RaceServer } from "../server";
// import { Room, User } from "../types";
// import { getUserInRoom, getUsersInRoom, addUser, deleteUser } from "../users/users"


// export class Rooms {
//     public rooms: Room[]
//     private server: RaceServer



//     constructor(server: RaceServer) {
//         this.server = server
//     }


//     onUserConnection() {

//         this.server.io.on("connection", (socket: SocketIO.Socket) => {
//             socket.on('login', (name: string, room: Room, callback: Function) => {
//                 const { user, error } = addUser(socket.id, name, room)
//                 if (!user) return callback(error);
//                 if (error) return callback(error);
//                 socket.join(user.room.roomId)
//                 socket.in(user.room.roomId).emit('notification', {
//                     message: `${user.name} joined`
//                 })
//                 callback()
//             })


//             socket.on('disconnect', (room : Room) => {
//                 const user = deleteUser(socket.id, room);
//                 if (user) {
//                     this.server.io.in(user.room.roomId).emit('notification', {
//                         message: `${user.name} has left`
//                     });
//                 }
//             })
//         })


//     }



//     async getUsersInCurrentRoom(room: Room) {
//         const usersId = await this.server.io.in(room.roomId).allSockets();
//         return usersId;
//     }


//     getRooms() {
//         return this.rooms;
//     }

//     


//     // findAvailableRoom() {
//     //     for (let i = 0; i < this.rooms.length; i++) {
//     //         if (this.rooms[i].users.length < 2) return this.rooms[i]
//     //     }
//     //     // this.createRoom
//     // }

//     // joinRoom() {
//     //     this.server.io.sockets.on("connection", (socket: SocketIO.Socket) => {
//     //         socket.on("joinRoom", (room : Room) => {
//     //             room = this.findAvailableRoom();
//     //             socket.join(availableRoom?.roomId);
//     //         })
//     //     })

//     // }

// }