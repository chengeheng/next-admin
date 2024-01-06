import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const key = "node-admin-jwt";

// const sign = (load) => {
//   const payload = { data: load };
//   const expiresIn = { expiresIn: 86400 };
//   return jwt.sign(payload, key, expiresIn);
// };

// const verify = (token) => {
//   try {
//     jwt.verify(token, key);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

const authMiddleware = async (req: Request, res: Response, next) => {
  console.log("query: %c%s ", "color: red;", req.query, req.url);
  const tokenHeaderKey = "Authorization";
  const token = req.header(tokenHeaderKey);
  if (!token) {
    return res.status(401).json({ error: "用户未登录" });
  }
  const verified = await jwt.verify(token, key);
  if (verified) {
    next();
  } else {
    return res.status(401).json({ error: "无效的token" });
  }
};

export default authMiddleware;
