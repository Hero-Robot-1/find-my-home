import * as properties from '../controllers/properties.controller.js';
import express from 'express';

export const routes = express.Router();

routes.get('/', (req, res) => {
    res.json({ message: "Hello from server :)" });
});

routes.post("/properties", properties.createProperty);

routes.get("/properties", properties.listProperties);

routes.post("/properties/sync/yad2", properties.syncProperties);

routes.patch("/properties/:id", properties.updateProperty);


