import express from "express";
import cors from "cors";
import * as http from "http";
import {Message} from '../types'
import SocketIO from "socket.io";
import { PORT } from "../environment/environment";
import { Rooms } from "../rooms/rooms";

export class RaceServer {
  public static readonly PORT: number = 8080;
  
  private app: express.Application;
  private server: http.Server;
  private port: string | number;
  private rooms: Rooms

  public io: SocketIO.Server;



  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
    this.rooms = new Rooms();
  }

  private createApp(): void {
    this.app = express();
    this.app.use(cors());
  }

  private createServer(): void {
    this.server = http.createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || PORT;
  }

  private sockets(): void {
    this.io = require("socket.io")(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on("connect", (socket: SocketIO.Socket) => {
      console.log("Connected client on port %s.", this.port);

      socket.on("join", ({ user, roomId }) => {
        try {
          this.rooms.createIfNeeded(roomId)
          this.rooms.addUser(user, roomId)

          if (this.rooms.checkIfFull(roomId)) { 
            socket.in(roomId).emit('startGame')
          }
          
          console.log(`User ${user.name}: ${user.id} connected to room ${roomId}.`);
          socket.join(roomId)
          socket.in(roomId).emit('notification', {
            message: `${user.name} joined`
          })
        } catch (e) {
          console.log(`[RACE_SERVER] Error in "join": ${e}`)
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  public countAllUsers(){
    const quantity = this.io.of("/").sockets.size;
    console.log(quantity);
    return quantity;
     
  }

  public getApp(): express.Application {
    return this.app;
  }
}