import * as express from "express";
import activeRoutes from "./active";
import quizRoutes from "./quiz";

const router = express.Router();
router.use(activeRoutes);
router.use(quizRoutes);

export default router;
