import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { JWT_KEY } from "../config";

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
  // const tokenHeaderKey = "Authorization";
  // const token = req.header(tokenHeaderKey);
  // if (!token) {
  //   return res.status(401).json({ error: "用户未登录" });
  // }
  // const verified = await jwt.verify(token, JWT_KEY);
  // if (verified) {
  //   next();
  // } else {
  //   return res.status(401).json({ error: "无效的token" });
  // }
  req.passport &&
    req.passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user)
        return res.send({ success: true, code: 0, message: "权限禁止" });

      console.log(user);

      req.userInfo = user;
      next();
    });
};

export default authMiddleware;
