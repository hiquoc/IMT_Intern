import createHttpError from "http-errors"
import { errorResponse } from '../utils/mappers/response.mapper.js'

export default function errorMiddleware(err, req, res, next) {
    if (err.issues) {
        const errorCode = err.issues[0].message;
        return res.status(400).json(errorResponse(errorCode));
    }

    console.log(err);
    const statusCode = err.status || 500;
    
    let errorCode = err.message;
    if (errorCode === "Route not found" || errorCode === "route_not_found") {
        errorCode = "ROUTE_NOT_FOUND";
    } else if (errorCode === "Unauthorized" || errorCode === "unauthorized") {
        errorCode = "UNAUTHORIZED";
    } else if (errorCode === "Invalid token" || errorCode === "auth.invalid_token") {
        errorCode = "INVALID_TOKEN";
    } else if (!errorCode) {
        errorCode = "INTERNAL_ERROR";
    }

    res.status(statusCode).json(
        errorResponse(errorCode)
    );
}
