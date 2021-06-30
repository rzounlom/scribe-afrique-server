import { ApolloServer } from 'apollo-server-express';
import PostModel from './db/models/PostModel';
import UserModel from './db/models/UserModel';
import cors from 'cors';
import db from './db';
import express from 'express';
import expressJwt from 'express-jwt';
import resolvers from './resolvers';
import typeDefs from './schema/schema';
import { verifyJwt } from './utils/verifyJwt';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    console.log('req headers: ', req.headers.authorization);
    const token = req.headers.authorization
      ? req.headers.authorization.slice(7)
      : null;
    const user = verifyJwt(token) || null;
    console.log('jwtUserVerified: ', user);
    return { user, models: { PostModel, UserModel } };
  },
});

server.applyMiddleware({ app, path: `/graphql` });

app.listen(PORT, () => {
  db();
  console.info(`Server started on port ${PORT}`);
});
