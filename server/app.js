import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { routes } from './src/routes/properties.routes.js';
import { authRoutes } from './src/routes/authentication.routes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.use(authRoutes);
app.use(routes);

export default app;
