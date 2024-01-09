import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import authMiddleware from "@/server/middlewares/authMiddleware";
import User from "@/server/models/user";
import * as config from "../config";

const router = express.Router();

const Users = [{ username: "admin", password: "1234" }];

const sign = (load) => {
  const payload = { data: load };
  const expiresIn = { expiresIn: 86400 };
  return jwt.sign(payload, config.JWT_KEY, expiresIn);
};

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (
    Users.some((i) => {
      return i.username === username && i.password === password;
    })
  ) {
    const token = sign({ username, password });
    await res.cookie("authorization", token, {
      expires: new Date(Date.now() + config.JWT_EXPIRY),
    });
    res.status(200).send({ success: true });
  } else {
    res.status(401).send({ success: true });
  }
});

router.post("/validateToken", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const token = sign({ username, password });
  res.cookie("authorization", token, {
    expires: new Date(Date.now() + config.JWT_EXPIRY),
  });
  res.status(200).send({
    success: true,
  });
});

router.post("/register", async (req: Request, res: Response) => {
  const { username, password, userRole } = req.body;
  const checkUsername = await User.findOne({ user_name: username });
  if (checkUsername) {
    return res.send({
      success: true,
      code: 0,
      message: "该用户已存在",
    });
  } else {
    let userid = 0;
    const rows = await User.find({}).sort({ user_id: -1 }).limit(1);
    if (rows && rows.length) {
      userid = rows[0].user_id + 1;
    }
    const newUserInfo = new User({
      user_id: userid,
      user_name: username,
      user_password: password,
      user_role: userRole,
    });
    newUserInfo
      .save()
      .then((result) => {
        res.send({
          success: true,
          code: 1,
        });
      })
      .catch((err) => {
        console.log("add user error: ", err);
        res.send({
          success: true,
          code: 0,
          message: "注册失败! error: " + err.toString(),
        });
      });
  }
});

router.get("/health", authMiddleware, (req: Request, res: Response) => {
  res.status(200).send({ success: true });
});

export default router;
