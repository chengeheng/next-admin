import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import { v4 } from "uuid";

import User from "../models/user";
import * as config from "../config/index";

const GenerateToken = (user) => {
  return jwt.sign(
    {
      uuid: get(user, "uuid"),
      username: get(user, "username"),
      userRole: get(user, "role"),
    },
    config.JWT_KEY,
    {
      jwtid: v4(),
      expiresIn: config.JWT_EXPIRY,
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE,
      algorithm: config.JWT_ALG,
    }
  );
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // TAG remember this must add await
    const userInfo = await User.findOne({ username: username });
    if (userInfo) {
      if (userInfo.password === password) {
        const token = GenerateToken(userInfo);
        await res.cookie("authorization", token, {
          expires: new Date(Date.now() + config.JWT_EXPIRY),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        return res.send({ code: 1, token: "Bearer " + token });
      } else {
        return res.send({ code: 0, message: "密码错误！" });
      }
    } else {
      return res.send({ code: 0, message: "该用户不存在" });
    }
  } catch (err) {
    return res.send({
      code: 0,
      message: "登录失败! error: ",
      err,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("authorization");
  return res.send({ code: 1, message: "退出成功！" });
};

const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const checkUsername = await User.findOne({ username: username });
  if (checkUsername) {
    return res.send({
      code: 0,
      message: "该用户已存在",
    });
  } else {
    const newUserInfo = new User({
      username: username,
      password: password,
      role: role,
    });
    newUserInfo
      .save()
      .then((result) => {
        res.send({
          code: 1,
          message: "注册成功！",
        });
      })
      .catch((err) => {
        console.log("add user error: ", err);
        res.send({
          code: 0,
          message: "注册失败!  ",
          err: err.toString(),
        });
      });
  }
};

const refreshToken = (req: Request, res: Response) => {
  const { username, password } = req.body;
  const token = GenerateToken({ username, password });
  res.cookie("authorization", token, {
    expires: new Date(Date.now() + config.JWT_EXPIRY),
  });
  res.status(200).send({});
};

const getUserList = async (req: Request, res: Response) => {
  if (get(req, "userInfo.role") > 2) {
    try {
      const allUser = await User.find({});
      return res.send({
        code: 1,
        userList: allUser,
      });
    } catch (err) {
      return res.send({
        code: 0,
        message: "获取用户列表失败！",
        err: err,
      });
    }
  }
};

const updateUserInfo = async (req: Request, res: Response) => {
  const { uuid, role } = req.body;
  const { userInfo } = req;
  // admin or update self info
  if (userInfo.role === 3 || uuid === userInfo.uuid) {
    try {
      const { username, password } = req.body;
      const params = {
        username: username,
        uuid: uuid,
        password: password,
        role: role,
      };
      await User.findOneAndUpdate({ uuid: uuid }, params);
      return res.send({ code: 1, user: params });
    } catch (err) {
      return res.send({ code: 0, message: "权限不足，禁止修改！" });
    }
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userInfo } = req;
  if (userInfo.role === 3) {
    try {
      const { uuid } = req.body;
      const checkUser = await User.findOne({ uuid: uuid });
      if (checkUser) {
        await User.deleteOne({
          uuid: uuid,
        });
        return res.send({
          code: 1,
          message: "删除成功！",
        });
      } else {
        return res.send({ code: 0, message: "该用户不存在！" });
      }
    } catch (err) {
      return res.send({ code: 0, message: "权限不足，禁止修改！" });
    }
  }
};

export default {
  login,
  logout,
  register,
  refreshToken,
  getUserList,
  updateUserInfo,
  deleteUser,
};
