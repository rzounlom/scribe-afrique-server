import bcrypt from 'bcrypt';
import constants from '../common/constants';
import generateToken from '../utils/generateToken';

const Mutation = {
  //User Mutations/
  loginUser: async (
    parent,
    { data: { username, password } },
    { user, models: { UserModel } },
    info
  ) => {
    try {
      const foundUser = await UserModel.findOne({ username: username });
      //check if user exists
      if (!foundUser) {
        throw new Error('Invalid Credentials');
      }
      //check if passwords match
      const passwordsMatch = bcrypt.compareSync(password, foundUser.password);

      if (!passwordsMatch) {
        throw new Error('Invalid Credentials');
      }
      const token = generateToken(foundUser);
      return {
        token,
      };
    } catch (e) {
      throw new Error(e.message);
    }
  },

  createUser: async (
    parent,
    { data: { username, password, role } },
    { user, models: { UserModel } },
    info
  ) => {
    if (!user) {
      throw new Error('You must be logged in');
    }

    const userRole = user[constants.graphql_url_dev].role;
    if (userRole !== 'SUPER_ADMIN') {
      throw new Error('Not Authorized');
    }
    const userExists = await UserModel.findOne({ username: username });
    //handle error if email is already taken
    if (userExists) {
      throw new Error('Username already in use');
    }

    //create new user object to add to db
    const newUser = new UserModel({
      username,
      password,
      role,
    });

    try {
      //save user to db
      await newUser.save();
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
    { user, models: { UserModel } },
    info
  ) => {
    if (!user) {
      throw new Error('You must be logged in');
    }
    try {
      //find user
      const foundUser = await UserModel.findById(id);
      //check if user exists
      if (!foundUser) {
        throw new Error('User not found');
      }

      const userRole = user[constants.graphql_url_dev].role;

      if (userRole === 'SUPER_ADMIN' || foundUser.id === user.sub) {
        const currentUsername = foundUser.username;

        //check values to update match types
        foundUser.username =
          username && typeof username === 'string'
            ? username
            : foundUser.username;

        foundUser.password =
          password && typeof password === 'string'
            ? password
            : foundUser.password;

        if (userRole === 'SUPER_ADMIN') {
          foundUser.role == role && typeof role === 'string'
            ? role
            : foundUser.role;
        } else {
          foundUser.role = foundUser.role;
        }
        //save user
        await foundUser.save();

        return { message: `User ${currentUsername} updated` };
      } else {
        throw new Error('Not Authorized');
      }
    } catch (error) {
      return new Error(error);
    }
  },
  deleteUser: async (parent, { id }, { user, models: { UserModel } }, info) => {
    if (!user) {
      throw new Error('You must be logged  in');
    }
    const userRole = user[constants.graphql_url_dev].role;
    if (userRole !== 'SUPER_ADMIN') {
      throw new Error('Not Authorized');
    }
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
    { data: { title, description, image, published } },
    { user, models: { PostModel, UserModel } },
    info
  ) => {
    if (!user) {
      throw new Error('You must be logged in');
    }

    try {
      const author = user.sub;
      const post = new PostModel({
        author,
        title,
        description,
        image,
        published,
      });

      await post.save();
      return { message: 'Post successfully created' };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  updatePost: async (
    parent,
    { id, data: { title, description, image, published } },
    { user, models: { PostModel } },
    info
  ) => {
    if (!user) {
      throw new Error('You must be logged in');
    }

    //find post
    const post = await PostModel.findById(id);
    if (!post) {
      throw new Error('Post does not exist');
    }

    try {
      const userRole = user[constants.graphql_url_dev].role;
      if (userRole === 'SUPER_ADMIN' || user.sub === post.author.toString()) {
        post.title = title && typeof title === 'string' ? title : post.title;
        post.description =
          description && typeof description === 'string'
            ? description
            : post.description;
        post.image = image && typeof image === 'string' ? image : post.image;
        post.published =
          published && typeof published === 'boolean'
            ? published
            : post.published;

        await post.save();
        return { message: 'Post successfully updated' };
      } else {
        throw new Error('Not Authorized');
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  deletePost: async (
    parent,
    { id },
    { user, models: { UserModel, PostModel } },
    info
  ) => {
    if (!user) {
      throw new Error('You must be logged in');
    }
    try {
      //check if post exists
      const post = await PostModel.findById(id);
      if (!post) {
        throw new Error('Post not found');
      }
      const userRole = user[constants.graphql_url_dev].role;
      if (userRole === 'SUPER_ADMIN' || user.sub === post.author.toString()) {
        //find author post belongs to
        const foundUser = await UserModel.findById(post.author);

        //delete post from user's post array
        foundUser.posts = foundUser.posts.filter(
          (post) => post.id.toString() !== id.toString()
        );
        await foundUser.save();
        await PostModel.deleteOne({ _id: id });
        return {
          message: `Post successfully deleted`,
        };
      } else {
        throw new Error('Not Authorized');
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};

export default Mutation;
