import express from "express";
import createApolloGraphQLServer from "./graphql";
import { expressMiddleware } from '@apollo/server/express4';
import UserService from "./services/user";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running"});
    });

    const gqlServer = await createApolloGraphQLServer();
    app.use("/graphql", expressMiddleware(gqlServer, {
        context: async ({ req }) => {
            // @ts-ignore
            const token = req.headers['token'];
            try{
                const user = UserService.decodeJWTToken(token as string)
                return { user }
            } catch (error) {
                return {};
            } 
        }
    }));

    app.listen(PORT, () => {
        console.log("Server is running on the port", `http://localhost:${PORT}/graphql`);
    });
}

init();