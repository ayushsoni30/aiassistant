import express from "express";
import { getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import isAuth from "../middleware/isauth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.single("image"), updateAssistant);

export default userRouter;