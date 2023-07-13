import config from "../config";

import express from "express";
const app = express();

import { createServer as createHTTPSServer } from "https";



import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types/socket.io";
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.on("connection")
io.attachApp