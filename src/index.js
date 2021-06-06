import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import db from './db';
import UserModel from './db/models/User';
import PostModel from './db/models/Post';
import typeDefs from './schema/schema';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    User,
  },
  context: { models: { PostModel, UserModel } },
});

apolloServer.applyMiddleware({ app, path: `/graphql` });

app.listen(PORT, () => {
  db();
  console.info(`Server started on port ${PORT}`);
});
