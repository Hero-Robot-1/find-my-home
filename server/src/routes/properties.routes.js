import * as properties from '../controllers/properties.controller.js';
import express from 'express';
import { queryProperties } from "../controllers/properties.controller.js";

export const routes = express.Router();

routes.get('/', (req, res) => {
    res.json({ message: "Hello from server :)" });
});

routes.get("/properties", properties.listProperties);

routes.post("/properties/query", properties.queryProperties);

routes.post("/properties/init/yad2", properties.initProperties);

routes.post("/properties/sync", properties.syncProperties);

routes.patch("/properties/:id", properties.updateProperty);


