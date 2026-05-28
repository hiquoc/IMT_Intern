import prisma from "../libs/prisma.js";
import bcrypt from "bcrypt";
import { toAuthResponse } from "../utils/mappers/auth.mapper.js"
import { generateAccessToken } from "../utils/jwt.js"
import createHttpError from "http-errors";

async function register(registerDto) {
    validateRegisterDto(registerDto);
    try {
        const user = await prisma.user.create({
            data: {
                email: registerDto.email,
                hashedPassword: await hashPassword(registerDto.password),
            },
        });
        const accessToken = generateAccessToken(user);
        return toAuthResponse(user, accessToken);

    } catch (error) {
        if (error.code === "P2002")  {
            throw createHttpError(409, "Email already exists");
        }
        throw error;
    }
}

async function login(loginDto) {
    validateLoginDto(loginDto);
    const user = await prisma.user.findUnique({
        where: { email: loginDto.email },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.hashedPassword))) {
        throw createHttpError(401,"Incorrect email or password");
    }

    const accessToken = generateAccessToken(user);
    return toAuthResponse(user, accessToken);
}

export default {
    register,
    login,
};

////////////
function validateRegisterDto(registerDto) {
    if (!registerDto.email || !registerDto.password) {
        throw createHttpError(400,"Email and password are required");
    }
    if (registerDto.password.length < 6) {
        throw createHttpError(400,"Password must be at least 6 characters long");
    }
    /// Additional validation for email format can be added here
}
function validateLoginDto(loginDto) {
    if (!loginDto.email || !loginDto.password) {
        throw createHttpError(400,"Email and password are required");
    }
    if (loginDto.password.length < 6) {
        throw createHttpError(400,"Password must be at least 6 characters long");
    }
}
function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}