import config from "../config";

import { createServer as createHttpsServer } from "https";
import { createServer as createHttpServer } from "http";
const createServer = config.protocol == "https" ? createHttpsServer : createHttpServer;

import { Server } from "socket.io";
import express from "express";
const app = express();

import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, Socket } from "./types/socket.io";
import type { RawUser } from "msgroom/dist/types/socket.io";
import generateID from "./utils/generateID";

const users: Record<string, RawUser> = {};
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

function authError(socket: Socket, reason: string) {
    socket.emit("auth-error", { reason });
}

io.on("connection", socket => {
    socket.on("auth", options => {
        if (options.apikey) return authError(socket, "Apikeys and stuff is (not) in development");
        if (!options.user) return authError(socket, "No nickname provided.");
        if (options.user.length > 18) return authError(socket, "A nickname should not be longer than 18 characters");

        const userID = generateID(socket);
        for (const user in users) {
            if (user.startsWith(userID)) {
                fuck(user)
            }
        }

        socket.on("online", () => {
            socket.emit("online", Object.values(users));
        });
    
        socket.on("message", options => {
            if (options.type != "text") return socket.emit("werror", `type should be equal to "text"`);
            io.emit("message", {
                color: "#69420f",
                content: options.content,
                date: new Date(),
                
            })
        })
        
        socket.emit("auth-complete", userID)
    });
});