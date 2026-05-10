import { Router } from "express";
import { renderAdminPage } from "../controllers/adminCrontroller";

const router = Router();
router.get("/", renderAdminPage);
export default router;