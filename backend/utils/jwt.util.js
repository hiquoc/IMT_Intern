import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

function generateAccessToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            type: "access"
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m"
        }
    );
}

function generateRefreshToken(userId, ip, userAgent, sessionCreatedAt = Date.now()) {
    const jti = randomUUID();
    const payload = {
        userId,
        type: "refresh",
        jti,
        sessionCreatedAt,
    };

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d"
        }
    );

    return { refreshToken, jti, sessionCreatedAt };
}

function verifyAccessToken(token) {
    const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET
    );

    if (payload.type !== "access") {
        throw createHttpError(401, "Invalid token");
    }

    return payload;
}

function verifyRefreshToken(token) {
    const payload = jwt.verify(
        token,
        process.env.JWT_REFRESH_TOKEN_SECRET
    );

    if (payload.type !== "refresh") {
        throw createHttpError(401, "Invalid token");
    }

    return payload;
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};