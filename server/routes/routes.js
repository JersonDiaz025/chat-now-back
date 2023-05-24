import express from "express";
import authController from "../controllers/authController.js";
import msgController from '../controllers/message.js'
import verifyToken from "../middlewares/verifyToken.js";

//  Destructurin all controllers
const { login, register } = authController;

// Controllers msgs
const { saveMessages, getMessages } = msgController;

const router = express.Router();

// Routes auth
router.post('/login', login);
router.post('/signUp', register);

// Routes messages
router.post('/saveMsg',verifyToken, saveMessages);
router.get('/messages',verifyToken, getMessages);

export default router;