import generateToken from '../utils/generateToken';
import bcrypt from 'bcrypt';

const Query = {
  loginUser: async (
    parent,
    { data: { username, password } },
    { models: { User } },
    info
  ) => {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error('Invalid Credentials');
    }

    //check if passwords match
    const passwordsMatch = bcrypt.compareSync(password, user.password);

    if (!passwordsMatch) {
      throw new Error('Invalid Credentials');
    }

    const token = generateToken(user._id);
    return { token };
  },
};
