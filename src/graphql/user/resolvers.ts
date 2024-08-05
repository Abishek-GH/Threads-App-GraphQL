import UserService, { CreareUserPayload } from "../../services/user";

const queries = {
    getUserToken: async (_: any, payload: {email: string, password: string}) => {
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password
        })
        return token;
    },
    getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
        console.log(context);
    }
}

const mutations = {
    createUser: async(_: any, payload: CreareUserPayload ) => {
        const res = await UserService.createUser(payload);
        return res.id;
    },
};

export const resolvers = { queries, mutations };