const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
const JsonPlaceAPI = require('./api/jsonPlaceApi');

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
`;

const resolvers = {
    Query: {
        hello: (_, args) => `Hello ${args.name}`,
        users: async (parent, args, { dataSources }) => {
            return await dataSources.jsonPlaceAPI.getUsers();
        },
        user: async (_, args, { dataSources }) => {
            return await dataSources.jsonPlaceAPI.getUser(args.id);
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
