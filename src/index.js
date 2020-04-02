import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import appRoutes from './index.routes';

require('dotenv').config();

const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// load routes
app.use('/api', appRoutes);

app.get('/', (req, res) => res.send({ api: 'OK' }));

app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      status: 401,
      message: 'Invalid token',
    });
  }
});

app.use((err, req, res) => {
  res.status(500).json({
    status: 500,
    message: 'something went wrong',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running on port ${PORT}`);
});
