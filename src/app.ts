import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import appRouter from './routes';

const serverless = require('serverless-http');

config();

const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());


app.use("/api/v1",appRouter);

module.exports.handler = serverless(app);

export default app;