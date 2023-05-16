import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
  username: String,
  password: String,
});

export default mongoose.model('Auth', AuthSchema);