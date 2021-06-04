import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import db from './db';
import User from './db/models/User';
import Post from './db/models/Post';
import typeDefs from './schema/schema';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: { models: { User, Post } },
});

apolloServer.applyMiddleware({ app, path: `/graphql` });

app.listen(PORT, () => {
  db();
  console.info(`Server started on port ${PORT}`);
});
