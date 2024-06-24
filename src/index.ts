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
import processMessage from "./utils/processMessage.js";

import typia from "typia";
import { transformValidationToString } from "./utils/validate.js";
import random from "random";
import checkRatelimits from "./utils/ratelimits.js";

const COLORS = [ "#b38c16", "#2bb7b7", "#9c27b0", "#f44336", "#009688", "#d13e33", "#2aa0a0", "#975f4a", "#c51f57", "#6565db" ];
const users = Object.create(null) as Record<string, RawUser>;
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer);

io.on("connection", socket => {
    const userID = generateID(socket.conn.remoteAddress);
    if (checkRatelimits(userID)) return void socket.disconnect();

    const authError = (reason: string) => void socket.emit("auth-error", { reason });
    const werror = (reason: string) => void socket.emit("werror", reason);
    const sysMessage = (type: "error" | "info" | "success", message: string, isHtml = false) => void socket.emit("sys-message", { type, message, isHtml });

    socket.once("auth", options => {
        if (options.apikey) return void authError("Apikeys and stuff is (not) in development");
        if (!options.user) return void authError("No nickname provided.");
        if (options.user.length > 18) return void authError("A nickname should not be longer than 18 characters");

        const sessionIDNumbers = Object.keys(users)
            .filter( sessionID => sessionID.startsWith(userID) )
            .map( sessionID => Number(sessionID.replace(userID + "-", "")) );
        
        let sessionIDNumber = Math.max(...sessionIDNumbers) + 1;
        if (sessionIDNumber === -Infinity) sessionIDNumber = 0;
        const sessionID = `${userID}-${sessionIDNumber}`;

        const color = Object.values(users).find( user => user.session_id.startsWith(userID) )?.color ?? random.choice(COLORS) ?? COLORS[0];
        
        const user: RawUser = {
            id        : userID,
            session_id: sessionID,
            flags     : [],
            user      : options.user,
            color,
        };
        if (options.bot === true) user.flags.push("bot");
        users[sessionID] = user;

        socket.on("online", () => {
            if (checkRatelimits(userID)) return;
            socket.emit("online", Object.values(users));
        });
    
        socket.on("message", options => {
            if (checkRatelimits(userID)) return;
            const validation = transformValidationToString(typia.validate(options));
            if (validation) return void werror(validation);
            if (options.content.length > 2048 || options.content.length < 1) return void werror("A message should be 1-2048 characters.");
            
            io.emit("message", {
                color     : user.color,
                content   : processMessage(options.content),
                date      : new Date().toISOString(),
                id        : userID,
                session_id: sessionID,
                type      : "text",
                user      : user.user,
            });
        });

        socket.on("admin-action", options => {
            if (checkRatelimits(userID)) return;
            const validation = transformValidationToString(typia.validate(options));
            if (validation) return void werror(validation);
            const { args } = options;

            if (args[0] === "a") args.shift();
            sysMessage("error", "aight bet");
        });

        socket.on("change-user", newNick => {
            if (checkRatelimits(userID)) return;
            const validation = transformValidationToString(typia.validate(newNick));
            if (validation) return void werror(validation);
            if (newNick.length < 1 || newNick.length > 16) return void werror("A nickname should be 1-16 characters.");

            const oldUser = user.user;
            user.user = newNick;
            io.emit("nick-changed", {
                id        : userID,
                oldUser,
                newUser   : newNick,
                session_id: sessionID,
            });
        });
        
        socket.on("disconnect", () => {
            socket.disconnect(); // no more reconnection bs
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete users[sessionID];
            io.emit("user-leave", {
                id        : userID,
                session_id: sessionID,
                user      : user.user,
            });
        });

        socket.emit("auth-complete", userID, sessionID);
        io.emit("user-join", user);
    });
});

app.use(express.static("public"));

httpServer.listen(config.port, () => void console.log(`Running on port ${config.port}!`));

process.on("SIGINT", () => {
    io.emit("sys-message", {
        isHtml : true,
        type   : "error",
        message: "<h1>The server is closing, please refresh the window.</h1>",
    });
    io.disconnectSockets();
    io.close( error => void process.exit(error ? 2 : 0) );
});