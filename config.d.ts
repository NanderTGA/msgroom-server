import type { ServerOptions as HttpsServerOptions } from "https";
import type { ServerOptions as HttpServerOptions } from "http";

export type Config = {
    protocol: "http";
    options?: HttpServerOptions;
} | {
    protocol: "https";
    options: HttpsServerOptions;
};

declare const config: Config;

export default config;