import express from 'express';
import path from 'path';
import cors from 'cors';
import appRoutes from './index.routes';
import { ERROR_CODES } from './constants/errorCodes';
import { errorHandlerMiddleware } from './middlewares/errorHandler';

require('dotenv').config();

const { PORT, PUPPETEER_EXECUTABLE_PATH } = process.env;

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

app.use(errorHandlerMiddleware(ERROR_CODES));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`PUPPETEER_EXECUTABLE_PATH: ${PUPPETEER_EXECUTABLE_PATH}`);
});
