import express, { json } from 'express';
import cors from 'cors'
import routes from './routes/index.js'
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use('/', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app


