const User = {
  posts: async (parent, args, { models: { PostModel } }, info) => {
    try {
      const posts = await PostModel.find({});
      const userPosts = posts.filter(
        (post) => post.author.toString() === parent.id.toString()
      );
      return userPosts;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};

export default User;
