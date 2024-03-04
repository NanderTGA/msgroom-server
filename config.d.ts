import type { ServerOptions as HttpsServerOptions } from "https";
import type { ServerOptions as HttpServerOptions } from "http";

export type HttpConfig = {
    protocol: "http";
    options?: HttpServerOptions;
} | {
    protocol: "https";
    options: HttpsServerOptions;
};

export interface Config {
    port: number;
    httpOptions: HttpConfig
}

declare const config: Config;
export default config;