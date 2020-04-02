import jwt from 'jsonwebtoken';

export default () => ({
  login: (req, res) => {
    const response = authenticateUser(req.body);
    if (response) return res.status(200).json(response);
    return res
      .status(401)
      .json({ status: 401, errorText: 'Invalid username or password' });
  },
});

export const authenticateUser = ({ username, password }) => {
  const { USERNAME, PASSWORD, SECRET } = process.env;
  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign(
      {
        role: 'admin',
      },
      SECRET,
      { expiresIn: '24h' },
    );
    return { token };
  }
};
