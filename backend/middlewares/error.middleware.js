import createHttpError from "http-errors"
import { errorResponse } from '../utils/mappers/response.mapper.js'
export default function errorMiddleware(err, req, res, next) {
    if (err.issues) {
        const errorMessages = err.issues[0].message
        return res.status(400).json(errorResponse(errorMessages))
    }

    console.log(err)
    const statusCode = err.status || 500
    
    res.status(statusCode).json(
        errorResponse(err.message || "Internal server error")
    )
}