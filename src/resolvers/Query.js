const Query = {
  //Viewer Query
  me: async (parent, args, { user, models: { UserModel } }, info) => {
    try {
      console.log(user);
      const me = await UserModel.findById(user.sub);
      return me;
    } catch (error) {
      console.log(error);
      throw new Error('You must be logged in');
    }
  },
  //User Queries
  users: async (parent, args, { models: { UserModel } }, info) => {
    const users = await UserModel.find({});
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
