import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import Session from '../models/session.js'

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await User.findOne({ email });

      // Verificar que el usuario existe
      if (!user) {
        return res.status(401).json({ message: 'Invalid credencials' });
      }

      // Verificar que la contraseña es correcta
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credencials' });
      }

      // Crear token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      // Crear sesión
      const session = await Session.create({ user: user._id });

      // Enviar respuesta al cliente
      res.json({ token, user: { _id: user._id, name: user.name }, sessionId: session._id });
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Comprobamos si ya existe un usuario con ese nombre de usuario o correo electrónico
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ error: "El nombre de usuario o correo electrónico ya existe" });
      }

      // Creamos un nuevo usuario
      const user = new User({ username, email, password });
      await user.save();

      // Creamos un token de acceso JWT para el nuevo usuario
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Devolvemos la información del usuario y el token de acceso JWT
      res.status(201).json({ user: user.toJSON(), token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  },


  logout: async (req, res, next) => {
    try {
      const { sessionId } = req.body;

      // Buscar sesión por ID
      const session = await Session.findById(sessionId);

      // Verificar que la sesión existe
      if (!session) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }

      // Actualizar hora de finalización de sesión
      session.endAt = new Date();
      await session.save();

      // Enviar respuesta al cliente
      res.json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
      next(error);
    }
  },
}

export default authController;

