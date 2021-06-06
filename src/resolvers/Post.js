const Post = {
  author: async (parent, args, { models: { UserModel } }, info) => {
    try {
      const user = await UserModel.findById(parent.author);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};

export default Post;
