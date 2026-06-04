import { redisClient } from "../configs/redis.config.js";


export async function addSession(userId, jti, ip, userAgent) {
    const key = getKey(userId);
    const ts = Date.now();

    const prevSessions = await redisClient.zRange(key, 0, -1);
    if (prevSessions.length >= 5) {
        const sessionsToRemove = prevSessions.slice(0, prevSessions.length - 4);

        const multi = redisClient.multi();
        for (const session of sessionsToRemove) {
            multi.zRem(key, session);
            multi.del(`session:${session}`);
        }
        await multi.exec();
    }

    await redisClient.multi()
        .zAdd(key, {
            score: ts,
            value: jti
        })
        .hSet(`session:${jti}`, {
            ip,
            userAgent,
            createdAt: ts
        })
        .exec();
}

export async function hasSession(userId, jti) {
    const key = getKey(userId);
    const score = await redisClient.zScore(key, jti);
    return score !== null;
}

export async function removeSession(userId, jti) {
    const key = getKey(userId);

    await redisClient.multi()
        .zRem(key, jti)
        .del(`session:${jti}`)
        .exec();
}

export async function removeAllSessions(userId, jti) {
    const key = getKey(userId);

    const allSessions = await redisClient.zRange(key, 0, -1);

    const sessionsToRemove = allSessions.filter(session => session !== jti);

    if (sessionsToRemove.length > 0) {
        // console.log("Before:", await redisClient.zRange(key, 0, -1));

        const multi = redisClient.multi();

        for (const session of sessionsToRemove) {
            multi.zRem(key, session);
            multi.del(`session:${session}`);
        }

        await multi.exec();

        // console.log("Exec result:", multi);

        // console.log("After:", await redisClient.zRange(key, 0, -1));
    }
}

export async function rotateRefreshToken(userId, oldJti, newJti, ip, userAgent) {
    const key = getKey(userId);
    const ts = Date.now();
    await redisClient.multi()
        .zRem(key, oldJti)
        .zAdd(key, {
            score: ts,
            value: newJti
        })
        .hSet(`session:${newJti}`, {
            ip,
            userAgent,
            createdAt: ts
        })
        .del(`session:${oldJti}`)
        .exec();
}

export async function getAllSessions(userId, currentJti) {
    const key = getKey(userId);
    const sessionsWithScores = await redisClient.zRangeWithScores(key, 0, -1);

    const sessions = await Promise.all(
        sessionsWithScores.map(async ({ value: jti, score }) => {
            const metadata = await redisClient.hGetAll(`session:${jti}`);

            return {
                jti,
                current: jti === currentJti,
                createdAt: new Date(score).toISOString(),
                ...metadata
            };
        })
    );
    return sessions;
}

function getKey(userId) {
    return `user:${userId}:sessions`;
}

