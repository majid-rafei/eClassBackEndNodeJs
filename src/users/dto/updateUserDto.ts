export interface UpdateUserDto {
    // id: string;
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    permissionLevel: number;
}