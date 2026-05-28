import authService from '../services/auth.service.js';
import asyncHandle from '../utils/asyncHandle.js';
import { successResponse } from '../utils/mappers/response.mapper.js'

const register = asyncHandle(async (req, res, next) => {
    const response = await authService.register(req.body);
    res.status(201).json(successResponse(response));
});


const login = asyncHandle(async (req, res, next) => {
    const response = await authService.login(req.body);
    res.status(200).json(successResponse(response));
}
)

export default {
    register,
    login,
};