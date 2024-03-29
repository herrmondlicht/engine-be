import jwt from 'jsonwebtoken';

export const authenticateUser =
  ({ PORTAL_USERNAME, PORTAL_PASSWORD, SECRET }) =>
  ({ username, password }) => {
    if (username === PORTAL_USERNAME && password === PORTAL_PASSWORD) {
      const token = jwt.sign(
        {
          role: 'admin',
        },
        SECRET,
        { expiresIn: '24h' }
      );
      return { token };
    }
    throw new Error('Wrong username/password');
  };

export default () => ({
  login: (req, res) => {
    try {
      const response = authenticateUser(process.env)(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(401).json({ status: 401, errorText: error.message });
    }
  },
});
