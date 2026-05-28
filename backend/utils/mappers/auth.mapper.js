function toUserDto(user) {
    return {
        id: user.id,
        email: user.email
    };
}

function toAuthResponse(user, accessToken) {
    return {
        accessToken,
        user: toUserDto(user)
    };
}

export {
    toAuthResponse,
    toUserDto
};