import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import appRouter from './routes';

config();

const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());

app.use("/api/v1",appRouter);

export default app;