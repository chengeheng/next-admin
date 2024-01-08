import moment from "moment";
import mongoose from "mongoose";
import { v4 } from "uuid";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: { type: Number, required: true },
  user_uuid: { type: String, required: true },
  user_name: { type: String, required: true },
  user_password: { type: String, required: true },
  user_created: { type: Number || String },
  user_updated: { type: Number || String },
  user_role: { type: Number, required: true },
  // 0: 账户锁定(无权限) 1: 普通用户 2: admin 3: superadmin
});

userSchema.pre("validate", function (next) {
  this.user_uuid = this.user_uuid || v4();
  this.user_created = this.user_created || moment().format("X");
  this.user_updated = moment().format("X");
  next();
});

export default mongoose.model("users", userSchema);
