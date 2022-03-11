export interface JwtInputInterface {
    userId: number,
    email: string,
    permissionLevel: number,
    provider: 'email',
    name: string, // userFullName
    refreshKey: string,
}

export interface JwtOutputInterface {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
}