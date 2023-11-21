import * as properties from '../controllers/properties.controller.js';
import express from 'express';
import {createProperty} from "../controllers/properties.controller.js";

export const routes = express.Router();

routes.get('/', (req, res) => {
    res.json({ message: "Hello from server :)" } );
});

routes.post("/properties", properties.createProperty);
//
// routes.delete("/transactions/:id", transactions.deleteTransaction);
//
// routes.put("/transactions/:id", transactions.updateTransaction);

routes.get("/properties", properties.listProperties);

routes.post("/properties/sync/yad2", properties.syncProperties);


