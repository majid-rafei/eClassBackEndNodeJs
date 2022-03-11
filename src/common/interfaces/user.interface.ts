export interface UserInterface {
    id: number,
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    permissionLevel: number,
}

export interface UserWithCredentialsInterface {
    id: number,
    email: string,
    password: string,
    salt: string,
    username: string,
    firstName: string,
    lastName: string,
    permissionLevel: number,
}