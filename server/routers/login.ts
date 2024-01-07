import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "@/server/middlewares/authMiddleware";

import * as config from "../config";

const router = express.Router();

const Users = [{ username: "admin", password: "1234" }];

const sign = (load) => {
  const payload = { data: load };
  const expiresIn = { expiresIn: 86400 };
  return jwt.sign(payload, config.JWT_KEY, expiresIn);
};

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (
    Users.some((i) => {
      return i.username === username && i.password === password;
    })
  ) {
    const token = sign({ username, password });
    res.cookie("authorization", token, {
      expires: new Date(Date.now() + config.JWT_EXPIRY),
    });
    res.status(200).send({ success: true });
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

router.get("/health", authMiddleware, (req: Request, res: Response) => {
  res.status(200).send({ success: true });
});

export default router;
