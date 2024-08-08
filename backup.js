const express = require("express");
const { ApolloServer } = require("@apollo/server");
const bodyParser = require("body-parser");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const fs = require("fs");

const books = JSON.parse(fs.readFileSync('./books.json'));
const authors = JSON.parse(fs.readFileSync('./authors.json'));

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type Book {
                name: String!
                uniqueId: Int!
            }

            type Author {
                firstName: String!
                lastName: String!
                uniqueId: Int!
            }

            type Query {
                getBooks: [Book]
                getAuthors(name: String): [Author]
            }
        `,
        resolvers: {
            Query: {
                getBooks: () => books,
                getAuthors: (parent, args) => {
                    const { name } = args;
                    if (!args.name) {
                        return authors;
                    }
                    const normalizedInput = name.toLowerCase();

                    if (normalizedInput.includes(' ')) {
                        const [firstName, lastName] = normalizedInput.split(' ');
                        return authors.filter(author =>
                            author.firstName.toLowerCase() === firstName &&
                            author.lastName.toLowerCase() === lastName
                        );
                    } else {
                        return authors.filter(author =>
                            author.firstName.toLowerCase() === normalizedInput ||
                            author.lastName.toLowerCase() === normalizedInput
                        );
                    }
                },
            },
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
}

startServer();
