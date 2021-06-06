import Post from '../db/models/User';

const User = {
  posts: async (parent, args, ctx, info) => {
    try {
      const posts = await Post.find({});
      return posts.filter((post) => post.author === parent.id);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};

export default User;
