import createHttpError from "http-errors";
import { verifyAccessToken } from "../utils/jwt.js"

export default function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createHttpError(401, "Unauthorized"))
    }

    const accessToken = authHeader.split(" ")[1]
    try {
        const payload = verifyAccessToken(accessToken);

        req.user = payload;
        next();
    } catch {
        next(createHttpError(401, "Invalid token"))
    }
}