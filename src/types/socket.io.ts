import type {
    ClientToServerEvents as OfficialClientToServerEvents,
    ServerToClientEvents as OfficialServerToClientEvents,
} from "msgroom/types/socket.io";
import { Server as SocketIOServer } from "socket.io";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientToServerEvents extends OfficialClientToServerEvents {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents extends OfficialServerToClientEvents {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export interface SocketData {
    ID: string
    session_id: string
}