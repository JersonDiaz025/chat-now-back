import express from "express";
import authController from "../controllers/authController.js";
import msgController from '../controllers/message.js'

//  Destructurin all controllers
const { login, logout, register } = authController;

// Controllers msgs
const { saveMessages, getMessages } = msgController;

const router = express.Router();

// Routes auth
router.post('/login', login);
router.post('/signUp', register);

// Routes messages
router.post('/saveMsg', saveMessages);
router.get('/messages', getMessages);

export default router;