import { ServerOptions as HTTPSServerOptions } from "https";

declare const config: {
    https?: {
        enable?: false
    } | {
        enable: true
        options: HTTPSServerOptions
    }
    
    http?: {
        enable?: false
    } | {
        enable: true
        options: HTTPSServerOptions
    }
};

export default config;