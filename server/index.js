import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../server/config/mongoose.js';
import express from "express";
import morgan from 'morgan';
import { Server as Socketserver } from 'socket.io';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/routes.js';

// Port 
const PORT_SERVER = process.env.PORT || 3000;

// config express
const app = express();

// Create server 
const server = http.createServer(app);
const io = new Socketserver(server, { core: { origin: '*' } });

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);


// Conexion and run server
connectDB()
server.listen(PORT_SERVER, () => {
  console.log(`Server run in ${PORT_SERVER}`)
})