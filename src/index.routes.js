import express from "express";
import loginRouter from "./modules/Session/session.routes";

const router =  express.Router();

router.use("/session", loginRouter)

export default router;