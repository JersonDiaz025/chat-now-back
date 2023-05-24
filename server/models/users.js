import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const AuthSchema = new Schema({
  username: String,
  password: String,
  email: String
});

// Encrypt password
AuthSchema.statics.encryptPassword = async (password) => {
  const encryptPassword = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, encryptPassword);
};

// Compare password already exist in system
AuthSchema.statics.comparePassword = async (newPassword, password) => {
  return await bcrypt.compare(newPassword, password);
};

export default mongoose.model("Auth", AuthSchema);
