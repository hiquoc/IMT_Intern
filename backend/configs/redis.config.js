import { createClient } from "redis"

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("connect", () => {
    console.log("Redis Connected");
});

redisClient.on("error", (err) => {
    console.log("Redis error: " + err);
});

export default async function connectToRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}