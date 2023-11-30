import express from "express";
import { landingRoutes } from "./routes/landing.js";
import { playerRoutes } from "./routes/player.js";
import { lobbyRoutes } from "./routes/lobby.js";
import { runRoutes } from "./routes/run.js";

var app = express();

app.use('/lobby', lobbyRoutes);
app.use('/run', runRoutes);
app.use('/player', playerRoutes);
app.use('/', landingRoutes);

export { app };