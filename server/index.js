import express from 'express';
import bodyParser from 'body-parser';
import cors  from 'cors';
import { routes } from './routes/properties.routes.js';
import { authRoutes } from './routes/authentication.routes.js';
import { db } from './models/index.js'

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.use(authRoutes);
app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


