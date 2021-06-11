import { ApolloServer } from 'apollo-server-express';
import PostModel from './db/models/PostModel';
import UserModel from './db/models/UserModel';
import cors from 'cors';
import db from './db';
import express from 'express';
import expressJwt from 'express-jwt';
import resolvers from './resolvers';
import typeDefs from './schema/schema';

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    },
  })
);

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = req.user || null;
    return { user, models: { PostModel, UserModel } };
  },
});

server.applyMiddleware({ app, path: `/graphql` });

app.listen(PORT, () => {
  db();
  console.info(`Server started on port ${PORT}`);
});
