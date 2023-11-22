import express from 'express';
import * as authentication from '../controllers/authentication.controller.js';

export const authRoutes = express.Router();

authRoutes.post("/signup", authentication.signUp);

authRoutes.post("/login", authentication.login);
