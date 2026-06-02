export default function attachRefreshTokenToCookie(res, refreshToken) {
    const isProduction = process.env.NODE_ENV === "production";
    const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: days * 24 * 60 * 60 * 1000 || 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}