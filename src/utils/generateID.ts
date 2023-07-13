import { Socket } from "../types/socket.io";
import CryptoJS from "crypto-js"

/**
 * Generates a userID.
 * @param socket The instance of socket.
 * @returns The generated ID
 */
export default async function magic(socket: Socket): Promise<string> {
    if (!process.env.PASSWORD) throw new Error("No password provided")
    const cipher = CryptoJS.AES.encrypt(socket.conn.remoteAddress, process.env.PASSWORD)
    return cipher.toString()
}
export async function decrypt(cipher: CryptoJS.lib.CipherParams){
    if (!process.env.PASSWORD) throw new Error("No password provided")
    return CryptoJS.AES.decrypt(cipher, process.env.PASSWORD).toString(CryptoJS.enc.Utf8)
}