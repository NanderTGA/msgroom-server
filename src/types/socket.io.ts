import { ClientToServerEvents, ServerToClientEvents as OfficialServerToClientEvents } from "msgroom/dist/types/socket.io";
export { ClientToServerEvents, OfficialServerToClientEvents as ServerToClientEvents };
import { Socket as ServerSideSocket } from "socket.io";

export interface ServerToClientEvents extends OfficialServerToClientEvents {
    "auth-complete": (userID: string, sessionID?: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SocketData {
    ID: string
    session_id: string
}

export type Socket = ServerSideSocket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;