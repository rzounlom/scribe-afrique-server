import { ApolloServer } from 'apollo-server-express';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import PostModel from './db/models/PostModel';
import Query from './resolvers/Query';
import User from './resolvers/User';
import UserModel from './db/models/UserModel';
import cors from 'cors';
import db from './db';
import express from 'express';
import expressJwt from 'express-jwt';
import typeDefs from './schema/schema';

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
);

const PORT = process.env.PORT || 4000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
  },
  context: ({ req }) => {
    const user = req.user || null;
    return { user, models: { PostModel, UserModel } };
  },
});

apolloServer.applyMiddleware({ app, path: `/graphql` });

app.listen(PORT, () => {
  db();
  console.info(`Server started on port ${PORT}`);
});
