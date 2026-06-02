import prisma from "../libs/prisma.js";
import bcrypt from "bcrypt";
import { toAuthResponse } from "../utils/mappers/auth.mapper.js"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.util.js"
import createHttpError from "http-errors";
import { addSession, hasSession, removeSession, removeAllSessions, rotateRefreshToken, getAllSessions } from "../utils/redis.util.js";
import {UAParser} from "ua-parser-js";

async function register(registerDto, ip, userAgent) {
    validateRegisterDto(registerDto);
    try {
        const user = await prisma.user.create({
            data: {
                email: registerDto.email,
                hashedPassword: await hashPassword(registerDto.password),
            },
        });
        const parser = new UAParser(userAgent);
        const info = parser.getResult();

        const deviceName =`${info.browser.name} on ${info.os.name}`;
        const accessToken = generateAccessToken(user);
        const { refreshToken, jti } = generateRefreshToken(user, ip, deviceName);

        await addSession(user.id, jti, ip, deviceName);

        return { user, accessToken, refreshToken };

    } catch (error) {
        if (error.code === "P2002") {
            throw createHttpError(409, "Email already exists");
        }
        throw error;
    }
}

async function login(loginDto, ip, userAgent) {
    validateLoginDto(loginDto);
    const user = await prisma.user.findUnique({
        where: { email: loginDto.email },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.hashedPassword))) {
        throw createHttpError(401, "Incorrect email or password");
    }

    const accessToken = generateAccessToken(user);
    const parser = new UAParser(userAgent);
    const info = parser.getResult();
    const deviceName = `${info.browser.name} on ${info.os.name}`;
    const { refreshToken, jti } = generateRefreshToken(user.id, ip, deviceName);

    await addSession(user.id, jti, ip, deviceName);

    return { user, accessToken, refreshToken };
}

async function refresh(refreshToken, ip, userAgent) {
    const payload = verifyRefreshToken(refreshToken);

    const valid = await hasSession(payload.userId, payload.jti);

    if (!valid) {
        throw createHttpError(401, "Session revoked");
    }

    const user = payload.email
        ? { id: payload.userId, email: payload.email }
        : await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
        throw createHttpError(401, "Invalid session user");
    }
    const parser = new UAParser(userAgent);
    const info = parser.getResult();
    const deviceName = `${info.browser.name} on ${info.os.name}`;

    const accessToken = generateAccessToken(user);
    const { refreshToken: newRefreshToken, jti } = generateRefreshToken(user.id, ip, deviceName, payload.sessionCreatedAt);

    await rotateRefreshToken(payload.userId, payload.jti, jti, ip, deviceName);

    return { accessToken, refreshToken: newRefreshToken };
}

async function logout(refreshToken) {
    const payload = verifyRefreshToken(refreshToken);

    await removeSession(payload.userId, payload.jti);
}

async function logoutAllOtherSessions(refreshToken) {
    const payload = verifyRefreshToken(refreshToken);

    await removeAllSessions(payload.userId, payload.jti);
}

async function getSessions(refreshToken) {
    const payload = verifyRefreshToken(refreshToken);

    const sessions = await getAllSessions(payload.userId, payload.jti);
    return sessions;
}

export default {
    register,
    login,
    refresh,
    logout,
    logoutAllOtherSessions,
    getSessions
};

////////////
function validateRegisterDto(registerDto) {
    if (!registerDto.email || !registerDto.password) {
        throw createHttpError(400, "Email and password are required");
    }
    if (registerDto.password.length < 6) {
        throw createHttpError(400, "Password must be at least 6 characters long");
    }
    /// Additional validation for email format can be added here
}
function validateLoginDto(loginDto) {
    if (!loginDto.email || !loginDto.password) {
        throw createHttpError(400, "Email and password are required");
    }
    if (loginDto.password.length < 6) {
        throw createHttpError(400, "Password must be at least 6 characters long");
    }
}
function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}