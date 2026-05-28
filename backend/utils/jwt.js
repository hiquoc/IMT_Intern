import jwt from 'jsonwebtoken'

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    )
}

function verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, process.env.JWT_SECRET)
}

export {
    generateAccessToken,
    verifyAccessToken
}