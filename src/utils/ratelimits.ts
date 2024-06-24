import config from "../../config.js";

const { defaultTokens, refreshAfterMs } = config.ratelimits ?? { defaultTokens: 15, refreshAfterMs: 20 * 1000 };

const tokenInfos = Object.create(null) as Record<string, {
    tokens: number;
    lastRefreshed: number;
    banned?: boolean;
} | undefined>;

/**
 * Checks whether a user is currently ratelimited.
 * @param id The user's ID
 * @returns Whether to cancel the operation.
 */
export default function checkRatelimits(id: string): boolean {
    const tokenInfo = tokenInfos[id];
    if (!tokenInfo) {
        tokenInfos[id] = {
            lastRefreshed: Date.now(),
            tokens       : defaultTokens - 1,
            banned       : false,
        };
        return false;
    }

    if (tokenInfo.banned) return true;

    tokenInfo.tokens--;
    if (tokenInfo.tokens < defaultTokens * -2) tokenInfo.banned = true;
    if (tokenInfo.tokens < 0) return true;
    return false;
}

setInterval( () => {
    for (const tokenInfo of Object.values(tokenInfos)) {
        if (!tokenInfo) continue;
        if (Date.now() - tokenInfo.lastRefreshed < refreshAfterMs) continue;

        tokenInfo.lastRefreshed = Date.now();
        tokenInfo.tokens = defaultTokens;
    }
}, refreshAfterMs);