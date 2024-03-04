import config from "../config.js";

import { createServer as createHttpsServer } from "https";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
const app = express();
const httpServer = config.httpOptions.protocol === "http"
    ? ( config.httpOptions.options ? createHttpServer(config.httpOptions.options, app) : createHttpServer(app) )
    : createHttpsServer(config.httpOptions.options, app);

import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types/socket.io.js";
import type { RawUser } from "msgroom/types/socket.io";
import generateID from "./utils/generateID.js";

import typia from "typia";
import { transformValidationToString } from "./utils/validate.js";
import random from "random";

const COLORS = [ "#b38c16", "#2bb7b7", "#9c27b0", "#f44336", "#009688" ];
const users = Object.create(null) as Record<string, RawUser>;
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer);

io.on("connection", socket => {
    const authError = (reason: string) => void socket.emit("auth-error", { reason });
    const werror = (reason: string) => void socket.emit("werror", reason);

    socket.on("auth", options => {
        if (options.apikey) return void authError("Apikeys and stuff is (not) in development");
        if (!options.user) return void authError("No nickname provided.");
        if (options.user.length > 18) return void authError("A nickname should not be longer than 18 characters");

        const userID = generateID(socket.conn.remoteAddress);
        const sessionIDNumbers = Object.keys(users)
            .filter( sessionID => sessionID.startsWith(userID) )
            .map( sessionID => Number(sessionID.replace(userID + "-", "")) );
        
        let sessionIDNumber = Math.max(...sessionIDNumbers) + 1;
        if (sessionIDNumber === -Infinity) sessionIDNumber = 0;
        const sessionID = `${userID}-${sessionIDNumber}`;

        const user: RawUser = {
            id        : userID,
            session_id: sessionID,
            flags     : [],
            user      : options.user,
            color     : random.choice(COLORS) ?? COLORS[0],
        };
        users[sessionID] = user;

        socket.on("online", () => {
            socket.emit("online", Object.values(users));
        });
    
        socket.on("message", options => {
            const validation = transformValidationToString(typia.validate(options));
            if (validation) return void werror(validation);
            
            io.emit("message", {
                color     : user.color,
                content   : options.content,
                date      : new Date().toISOString(),
                id        : userID,
                session_id: sessionID,
                type      : "text",
                user      : user.user,
            });
        });
        
        socket.emit("auth-complete", userID, sessionID);
        io.emit("user-join", user);
    });
});

app.use(express.static("public"));

httpServer.listen(config.port, () => void console.log(`Running on port ${config.port}!`));