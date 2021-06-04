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
      }
      //return user to client
      return { message: `There was an issue creating the user` };
    }
  },
};

export default Mutation;
