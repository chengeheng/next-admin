import express, { Request, Response } from "express";
import authMiddleware from "@/server/middlewares/authMiddleware";

const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  res.status(200).send({ success: true });
});

router.get("/health", authMiddleware, (req: Request, res: Response) => {
  res.status(200).send({ success: true });
});

export default router;
