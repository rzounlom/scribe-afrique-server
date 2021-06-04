import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    #User queries
    user(id: ID!): User
    users: [User]!
    loginUser(data: LoginUserInput): Token

    #Post queries
    post(id: ID!): Post
  }

  type Mutation {
    #User mutations
    createUser(data: CreateUserInput): Message!
    updateUser(id: ID!, data: UpdateUserInput): Message!
    deleteUser(id: ID!): Message!

    #Post mutations
  }

  # USER Type
  type User {
    id: ID!
    username: String!
    role: UserRole
    posts: [Post]!
  }

  input CreateUserInput {
    username: String!
    password: String!
    role: String
  }

  input UpdateUserInput {
    username: String
    password: String
    role: UserRole
  }

  input LoginUserInput {
    username: String!
    password: String!
  }

  enum UserRole {
    USER
    ADMIN
    SUPER_ADMIN
  }

  type Token {
    token: String!
  }

  type Post {
    id: ID!
    author: User!
    title: String!
    description: String!
    image: String!
  }

  #  Message Type
  type Message {
    message: String!
  }
`;

export default typeDefs;
