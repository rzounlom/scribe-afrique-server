import generateToken from '../utils/generateToken';
import bcrypt from 'bcrypt';

const Query = {
  //User Queries

  loginUser: async (
    parent,
    { data: { username, password } },
    { models: { UserModel } },
    info
  ) => {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      throw new Error('Invalid Credentials');
    }

    //check if passwords match
    const passwordsMatch = bcrypt.compareSync(password, user.password);

    if (!passwordsMatch) {
      throw new Error('Invalid Credentials');
    }

    const token = generateToken(user);
    return { token };
  },
  users: async (parent, args, { models: { UserModel } }, info) => {
    const users = await UserModel.find({});
    console.log(users);
    return users;
  },
  user: async (parent, { id }, { models: { UserModel } }, info) => {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      return new Error(error);
    }
  },
  //Post Queries

  posts: async (parent, _, { models: { PostModel } }, info) => {
    try {
      const posts = await PostModel.find({});
      return posts;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  post: async (parent, { id }, { models: { PostModel } }, info) => {
    try {
      const post = await PostModel.findById(id);
      return post;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};

export default Query;
