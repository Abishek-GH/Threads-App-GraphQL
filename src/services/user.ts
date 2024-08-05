import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from 'node:crypto'
import JWT from "jsonwebtoken";

const JWT_SECRET = "superman";

export interface CreareUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    profileImageURL: string
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

class UserService{

    private static generateHash (salt: string, password: string) {
        const hashedPassword = createHmac('sha256', salt).update(password).digest("hex")
        return hashedPassword
    }
    public static createUser(payload: CreareUserPayload) {
        var { firstName, lastName, email, password, profileImageURL } = payload
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt, password);
        lastName = lastName || "";
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: hashedPassword,
                profileImageURL
            }
        });
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email }})
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;

        const user = await UserService.getUserByEmail(email);

        if(!user) throw new Error('User not found');

        const userSalt = user.salt
        const usersHashPassword = UserService.generateHash(userSalt, password);

        if(usersHashPassword !== user.password) throw new Error("Invalid password");

        const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET)
        return token;
    } 
}

export default UserService