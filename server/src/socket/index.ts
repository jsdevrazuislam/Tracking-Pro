import { Socket, Server } from "socket.io";
import { Request } from "express";
import { decode_token } from "@/utils/auth-helper";
import { JwtResponse, UserType } from "@/types/auth";
import { SocketEventEnum } from "@/constants";
import { User } from "@/models";

declare module "socket.io" {
  interface Socket {
    user?: UserType;
  }
}

interface SocketAuth {
  token?: string;
}

export interface InitializeSocketIOOptions {
  io: Server;
}

interface EmitSocketEventParams<T> {
  req: Request;
  roomId: string;
  event: string;
  payload: T;
}

const activeAgents = new Map<string, { parcelId: string; socketId: string }>();

const initializeSocketIO = ({ io }: InitializeSocketIOOptions): void => {
  io.on("connection", async (socket: Socket) => {
    try {
      const auth = socket.handshake.auth as SocketAuth;

      let token: string | undefined = auth.token;

      let user: User | null = null;

      if (token && process.env.ACCESS_TOKEN_SECRET) {
        try {
          const decodedToken = decode_token(
            token,
            process.env.ACCESS_TOKEN_SECRET
          ) as JwtResponse;

          user = await User.findOne({ where: { id: decodedToken.id } });

          if (!user) {
            throw new Error("Token is invalid: User not found");
          }

          socket.user = user;
          const userId = user.id;
          socket.join(user.id.toString());

          socket.join(`user:${userId}`);
          console.log(
            `Authenticated user connected userId: ${user.id.toString()}`
          );
        } catch (error) {
          console.error("Invalid token provided:", error);
        }
      }

      const connectionEvent = user
        ? SocketEventEnum.SOCKET_CONNECTED
        : SocketEventEnum.SOCKET_ERROR;

      const connectionMessage = user
        ? "Authenticated Socket Connected"
        : "Unauthenticated Socket Connected";

      socket.emit(connectionEvent, connectionMessage);

      if (!user) {
        console.log("Unauthenticated user connected");
      }

      socket.on(SocketEventEnum.AGENT_JOIN, (parcelId: string) => {
        activeAgents.set(socket.id, { parcelId, socketId: socket.id });
        console.log(`Agent connected for parcel ${parcelId}`);
      });

      socket.on(SocketEventEnum.JOIN_CLIENT_PARCEL, (parcelId: string) => {
        socket.join(parcelId);
        console.log(`Client joined parcel ${parcelId}`);
      });

      socket.on(
        SocketEventEnum.PARCEL_LOCATION,
        (data: { trackingId: string; coords: number[] }) => {
          io.to(data.trackingId).emit(SocketEventEnum.PARCEL_LOCATION, {
            latitude: data.coords[1],
            longitude: data.coords[0],
            timestamp: new Date().toISOString(),
          });
        }
      );
    } catch (error) {
      console.error("Socket connection error:", error);
      activeAgents.delete(socket.id);
      socket.emit(
        SocketEventEnum.SOCKET_ERROR,
        error instanceof Error
          ? error.message
          : "Something went wrong while connecting to the socket"
      );
    }
  });
};

const emitSocketEvent = <T>({
  req,
  roomId,
  event,
  payload,
}: EmitSocketEventParams<T>): void => {
  try {
    const io: Server = req.app.get("io");
    io.to(roomId).emit(event, payload);
    console.log(`Event sent roomId ${roomId} and event name is ${event}`);
  } catch (error) {
    console.error("Failed to emit socket event:", error);
  }
};

export { initializeSocketIO, emitSocketEvent, SocketEventEnum };
