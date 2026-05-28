import createHttpError from "http-errors"

export default function notFoundMiddleware(req, res, next) {
    next(createHttpError(404, "Route not found"))
}