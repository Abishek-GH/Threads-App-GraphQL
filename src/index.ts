import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());

    // Create graphql Server
    const gqlServer = new ApolloServer({
        // Schema as a String
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `, 
        resolvers: {
            Query: {
                hello: () => "Hey There, I am a graphql server",
                say: (_, {name}: {name: string}) => `Hey ${name}, How are you?`,
            }
        } // Actual Function
    });

    // Start gql server
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running"});
    });


    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log("Server is running on the port", `http://localhost:${PORT}`);
    });
}

init();