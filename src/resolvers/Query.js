const Query = {
  //Viewer Query
  me: async (parent, args, { user, models: { UserModel } }, info) => {
    if (!user) {
      throw new Error('You must be logged in');
    }
    try {
      const me = await UserModel.findById(user.sub);
      if (!me) {
        throw new Error('You must be logged in');
      }
      return me;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  //User Queries
  users: async (parent, args, { user, models: { UserModel } }, info) => {
    if (!user) {
      throw new Error('You must be logged in');
    }
    try {
      const foudUsers = await UserModel.find({});
      return foudUsers;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  user: async (parent, { id }, { user, models: { UserModel } }, info) => {
    if (!user) {
      throw new Error('You must be logged in');
    }
    try {
      const foundUser = await UserModel.findById(id);
      return foundUser;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  //Post Queries

  posts: async (parent, _, { user, models: { PostModel } }, info) => {
    if (!user) {
      throw new Error('You must be logged in');
    }
    try {
      const posts = await PostModel.find({});
      return posts;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  post: async (parent, { id }, { user, models: { PostModel } }, info) => {
    if (!user) {
      throw new Error('You must be logged in');
    }
    try {
      const post = await PostModel.findById(id);
      return post;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  userPosts: async (
    parent,
    { type },
    { user, models: { PostModel } },
    info
  ) => {
    if (!user) {
      throw new Error('You must be logged in');
    }

    const posts = await PostModel.find({ author: user.sub });
    switch (type) {
      case 'all':
        return posts;
      case 'published':
        return posts.filter((post) => post.published);
      case 'unpublished':
        return posts.filter((post) => !post.published);
      default:
        return posts;
    }
  },
};

export default Query;
