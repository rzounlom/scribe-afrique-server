import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  const { id, role } = user;
  return jwt.sign(
    { 'http://localhost:4000/graphql': { role } },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: id,
      expiresIn: '30d',
    }
  );
};

export default generateToken;
