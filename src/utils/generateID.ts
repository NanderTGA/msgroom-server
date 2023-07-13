import { Socket } from "../types/socket.io";
import CryptoJS from "crypto-js"

/**
 * Generates a userID.
 * @param socket The instance of socket.
 * @returns The generated ID
 */
export default async function magic(socket: Socket): Promise<string> {
    CryptoJS.AES.encrypt
}