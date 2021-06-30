import jwt from 'jsonwebtoken';

export const verifyJwt = (token) => {
  const user = jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (error, decodedUser) {
      if (error) {
        console.log(error);
        return false;
      }
      return decodedUser;
    }
  );
  console.log('verifiedToken:  ', user);
  return user;
};
