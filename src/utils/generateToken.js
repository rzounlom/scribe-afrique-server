import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  const { id, role } = user;
  return jwt.sign({ role }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    subject: id,
    expiresIn: '1d',
  });
};

export default generateToken;
