import authService from '../services/auth.service.js';
import asyncHandle from '../utils/asyncHandle.js';
import attachRefreshTokenToCookie from '../utils/cookie.util.js';
import { toAuthResponse } from '../utils/mappers/auth.mapper.js';
import { successResponse } from '../utils/mappers/response.mapper.js'

const register = asyncHandle(async (req, res, next) => {
    const { user, accessToken, refreshToken } =
        await authService.register(req.body, req.ip, req.get("user-agent"));
    attachRefreshTokenToCookie(res, refreshToken);

    res.status(201).json(successResponse(toAuthResponse(user, accessToken)));
});


const login = asyncHandle(async (req, res, next) => {
    const { user, accessToken, refreshToken } =
        await authService.login(req.body, req.ip, req.get("user-agent"));
    attachRefreshTokenToCookie(res, refreshToken);

    res.status(200).json(successResponse(toAuthResponse(user, accessToken)));
});

const refresh = asyncHandle(async (req, res, next) => {
    const { accessToken, refreshToken } =
        await authService.refresh(req.cookies.refreshToken, req.ip, req.get("user-agent"));
    attachRefreshTokenToCookie(res, refreshToken);

    res.status(200).json(successResponse(accessToken));
})

const logout = asyncHandle(async (req, res, next) => {
    res.clearCookie("refreshToken");
    await authService.logout(req.cookies.refreshToken);
    res.status(204).send();
})

const logoutAllOtherSessions = asyncHandle(async (req, res, next) => {
    await authService.logoutAllOtherSessions(req.cookies.refreshToken);
    res.status(200).json(successResponse("OTHER_SESSIONS_LOGGED_OUT"));
})

const getSessions = asyncHandle(async (req, res, next) => {
    const sessions = await authService.getSessions(req.cookies.refreshToken);
    res.status(200).json(successResponse(sessions));
});

export default {
    register,
    login,
    refresh,
    logout,
    logoutAllOtherSessions,
    getSessions
};
