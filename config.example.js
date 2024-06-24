/** @type {typeof import("./config").default} */
export default {
    port       : 4096,
    httpOptions: {
        protocol: "http",
    },
    ratelimits: {
        defaultTokens : 15,
        refreshAfterMs: 20 * 1000,
    },
};