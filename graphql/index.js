const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
const JsonPlaceAPI = require('./api/jsonPlaceApi');
const { PrismaClient } = require('@prisma/client');
const { argsToArgsConfig } = require('graphql/type/definition');

const prisma = new PrismaClient();

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        myPosts: [Post]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        userId: ID!
    }

    type Query {
        hello(name: String!): String
        users: [User]
        user(id: ID!): User
        posts: [Post]
    }

    type Mutation {
        createUser(name: String!, email: String!): User
        updateUser(id: Int!, name: String!): User
        deleteUser(id: Int!): User
    }
`;

const resolvers = {
    Query: {
        hello: (_, args) => `Hello ${args.name}`,
        users: () => {
            return prisma.user.findMany();
        },
        user: (_, args) => {
            return prisma.user.findUnique({ where: { id: Number(args.id) } });
        },
        posts: async (_, __, { dataSources }) => {
            return await dataSources.jsonPlaceAPI.getPosts();
        },
    },
    User: {
        myPosts: async (parent, __, { dataSources }) => {
            const response = await dataSources.jsonPlaceAPI.getPosts();
            const myPosts = response.filter((post) => post.userId == parent.id);
            return myPosts;
        },
    },
    Mutation: {
        createUser: (_, args) => {
            return prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                },
            });
        },
        updateUser: (_, args) => {
            return prisma.user.update({
                where: {
                    id: args.id,
                },
                data: {
                    name: args.name,
                },
            });
        },
        deleteUser: (_, args) => {
            return prisma.user.delete({
                where: { id: args.id },
            });
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            jsonPlaceAPI: new JsonPlaceAPI(),
        }
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
});
