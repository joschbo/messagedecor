import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import * as MessageDecorService from './services/messageDecorService';
import { validateMessage } from "../../common/MessageValidator";

dotenv.config({ path: path.join(__dirname, '../.env') });
import { handleError } from './helpers/error';
import httpLogger from './middlewares/httpLogger';
import rateLimit from 'express-rate-limit';

const app: express.Application = express();
const DAY = 86400000;

const limiter = rateLimit({
	windowMs: DAY, 
	limit: 20,
	standardHeaders: 'draft-8',
	legacyHeaders: false
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post("/api/decoratemessage", limiter, httpLogger, async (req, res) => {
  console.log(req);
  const inputMessage = req.body.message;
  if (!inputMessage) {
      res.status(400).send("Missing message");
      return;
  }
  
  const validationError = validateMessage(inputMessage);
  if (validationError.length > 0) {
      res.status(400).send(validationError.join("\n"));
      return;
  }

  try {
      const decoratedMessage = await MessageDecorService.decorateMessage(inputMessage);
      res.json({ message: decoratedMessage });
  } catch (e) {
      res.status(500).send(e.message);
  }
});

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../../../frontend/dist');
  console.info(`Serving static files from ${frontendPath}`);
  app.use(express.static(frontendPath));

  // SPA fallback to index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}


// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res) => {
  handleError(err, res);
};
app.use(errorHandler);

const port = process.env.PORT || '8000';
app.set('port', port);

const server = http.createServer(app);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
