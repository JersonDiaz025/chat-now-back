import jwt from "jsonwebtoken";
import User from "../models/users.js";

const authController = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // Buscar usuario por email
      const user = await User.findOne({ username });

      // Verificar que el usuario existe
      if (!user) {
        return res.json({ message: "Este nombre de usuario no existe" });
      }

      // Verificar que la contraseña es correcta
      const passwordMatch = await User.comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.json({ message: "Contraseña inválida" });
      }

      // Crear token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Enviar respuesta al cliente
      res.json({
        message: "Sucess",
        user: {
          token: token,
          _id: user._id,
          name: user.username,
          password: password,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Comprobamos si ya existe un usuario con ese nombre de usuario o correo electrónico
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res.status(400).json({
          error: "El nombre de usuario o correo electrónico ya existe",
        });
      }

      // Creamos un nuevo usuario
      const user = new User({
        username,
        email,
        password: await User.encryptPassword(password),
      });
      await user.save();

      // Creamos un token de acceso JWT para el nuevo usuario
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Devolvemos la información del usuario y el token de acceso JWT
      res.json({ user: user.toJSON(), token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  },
};

export default authController;
