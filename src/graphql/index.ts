import { ApolloServer } from '@apollo/server';
import { User } from "./user/index";

// Create graphql Server
async function createApolloGraphQLServer() {
    const gqlServer = new ApolloServer({
        // Schema as a String
        typeDefs: `
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutations}
            }
        `, 
        // Actual Function
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        } 
    });

    // Start gql server
    await gqlServer.start();

    return gqlServer;
}

export default createApolloGraphQLServer;