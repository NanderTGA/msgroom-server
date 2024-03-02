import { createHash } from "node:crypto";

export default function generateID(ip: string): string {
    return createHash("sha256").update(ip).digest("hex").toUpperCase();
}