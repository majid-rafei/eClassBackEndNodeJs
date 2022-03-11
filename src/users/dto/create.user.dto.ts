export interface CreateUserDto {
    email: string;
    password: string;
    salt: string;
    firstName?: string;
    lastName?: string;
    permissionLevel?: number;
    createdAt: Date;
}