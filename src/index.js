import express from 'express';
import path from 'path';
import cors from 'cors';
import appRoutes from './index.routes';

require('dotenv').config();

const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

// load routes
app.use('/api', appRoutes);

app.get('/', (req, res) => res.send({ api: 'OK' }));

app.use((err, req, res, next) => {
  console.log('errr not', err);
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 401,
      message: 'Invalid token',
    });
  }
  if (err) {
    return next(err);
  }
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
    });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running on port ${PORT}`);
});
