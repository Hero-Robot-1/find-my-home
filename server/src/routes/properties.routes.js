import * as properties from '../controllers/properties.controller.js';
import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';

export const routes = express.Router();

routes.get('/', (req, res) => {
    res.json({ message: "Hello from server :)" });
});

routes.get("/properties", requireAuth, properties.listProperties);

routes.post("/properties/query", requireAuth, properties.queryProperties);

routes.post("/properties/init/yad2", requireAuth, properties.initProperties);

routes.post("/properties/sync", requireAuth, properties.syncProperties);

routes.patch("/properties/:id", requireAuth, properties.updateProperty);


