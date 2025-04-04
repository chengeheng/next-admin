import express from "express";

import AuthController from "../controller/auth";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * GET（SELECT）：从服务器取出资源（一项或多项）。
 * POST（CREATE）：在服务器新建一个资源。
 * PUT（UPDATE）：在服务器更新资源（客户端提供完整资源数据）。
 * PATCH（UPDATE）：在服务器更新资源（客户端提供需要修改的资源数据）。
 * DELETE（DELETE）：从服务器删除资源。
 */
router.post("/login", AuthController.login);
router.get("/check", authMiddleware, AuthController.check);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/token/refresh", authMiddleware, AuthController.refreshToken);
router.put("/user", authMiddleware, AuthController.updateUserInfo);
router.post("/user", authMiddleware, AuthController.register);
router.delete("/user", authMiddleware, AuthController.deleteUser);
router.get("/user/list", authMiddleware, AuthController.getUserList);

export default router;
