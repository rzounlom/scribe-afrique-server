const Mutation = {
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
        console.log(error);
        throw new Error(error);
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
      console.log(user);
      return { message: `User ${currentUsername} updated` };
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  },
};

export default Mutation;
