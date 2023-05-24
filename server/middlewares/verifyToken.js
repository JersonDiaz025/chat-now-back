import jwt from "jsonwebtoken";
import User from '../models/users.js'

// function verify token for continue protect routes
export default async function verifyToken(req, res, next) {
  try {
    const token = req.headers["Authorization"];

    // verifi token in headers
    if (!token)
      return res
        .status(403)
        .json({ success: false, message: "Token no proporcionado" });

    // search id user in token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // search id user in db
    const user = await User.findById(decodedToken.id, { password: 0 });
    console.log(user)

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User no found" });
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Unauthorized" });
  }
}
