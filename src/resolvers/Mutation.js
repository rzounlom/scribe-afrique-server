const Mutation = {
  //**User Mutations */
  createUser: async (
    parent,
    { data: { username, password, role } },
    { models: { User } },
    info
  ) => {
    const userExists = await User.findOne({ username: username });

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
        throw new Error(error.message);
      }
    }
  },
  updateUser: async (
    parent,
    { id, data: { username, password, role } },
    { models: { User } },
    info
  ) => {
    try {
      //find user
      const user = await User.findById(id);
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
  deleteUser: async (parent, { id }, { models: { User } }, info) => {
    try {
      //ensure id is passed
      if (!id) {
        throw new Error('User Id is required');
      }

      await User.deleteOne({ _id: id });

      return { message: `User successfully removed` };
    } catch (error) {
      return new Error(error.message);
    }
  },
  //**Post Mutations */
  createPost: async (
    parent,
    { author },
    { models: { User, Post } },
    info
  ) => {},
};

export default Mutation;
