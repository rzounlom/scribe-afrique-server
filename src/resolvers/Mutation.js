const Mutation = {
  //User Mutations/
  createUser: async (
    parent,
    { data: { username, password, role } },
    { models: { UserModel } },
    info
  ) => {
    const userExists = await UserModel.findOne({ username: username });

    //handle error if email is already taken
    if (userExists) {
      throw new Error('Username already in use');
    }

    //create new user object to add to db
    const user = new User({
      username,
      password,
      role,
    });

    try {
      //save user to db
      const newUser = await user.save();
      //return user to client
      return { message: `New user ${newUser.username} successfully created` };
    } catch (error) {
      if (error) {
        throw new Error(error);
      }
    }
  },
  updateUser: async (
    parent,
    { id, data: { username, password, role } },
    { models: { UserModel } },
    info
  ) => {
    try {
      //find user
      const user = await UserModel.findById(id);
      //check if user exists
      if (!user) {
        throw new Error('User not found');
      }

      const currentUsername = user.username;

      //check values to update match types
      user.username =
        username && typeof username === 'string' ? username : user.username;

      user.password =
        password && typeof password === 'string' ? password : user.password;

      user.role = role && typeof role === 'string' ? role : user.role;

      //save user
      await user.save();

      return { message: `User ${currentUsername} updated` };
    } catch (error) {
      return new Error(error);
    }
  },
  deleteUser: async (parent, { id }, { models: { UserModel } }, info) => {
    try {
      //ensure id is passed
      if (!id) {
        throw new Error('User Id is required');
      }

      await UserModel.deleteOne({ _id: id });

      return { message: `User successfully removed` };
    } catch (error) {
      return new Error(error);
    }
  },

  //**Post Mutations */
  createPost: async (
    parent,
    { data: { author, title, description, image, published } },
    { models: { PostModel, UserModel } },
    info
  ) => {
    //check if author exists
    const authorExists = await UserModel.findById(author);
    console.log(author);

    if (!authorExists) {
      return new Error('Author does not exist');
    }

    try {
      const post = new PostModel({
        author,
        title,
        description,
        image,
        published,
      });

      await post.save();
      console.log(post);
      return { message: 'Post successfully created' };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};

export default Mutation;
