import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    #User queries
    user(id: ID!): User
    users: [User]!
    me: User!

    #Post queries
    post(id: ID!): Post
    posts: [Post]!
  }

  type Mutation {
    #User mutations
    loginUser(data: LoginUserInput): Token!
    createUser(data: CreateUserInput): Message!
    updateUser(id: ID!, data: UpdateUserInput): Message!
    deleteUser(id: ID!): Message!

    #Post mutations
    createPost(data: createPostInput): Message!
    updatePost(id: ID!, data: updatePostInput): Message!
    deletePost(id: ID!): Message!
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
    ADMIN
    SUPER_ADMIN
  }

  type Token {
    token: String!
  }

  #  Message Type
  type Message {
    message: String!
  }

  #  Post Type
  type Post {
    id: ID!
    author: User!
    title: String!
    description: String!
    image: String!
    published: Boolean!
  }

  input createPostInput {
    title: String!
    description: String!
    image: String!
    published: Boolean!
  }

  input updatePostInput {
    title: String
    description: String!
    image: String!
    published: Boolean
  }
`;

export default typeDefs;
