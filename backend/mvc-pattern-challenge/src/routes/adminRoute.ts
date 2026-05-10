import { Router } from "express";
import {
    renderAdminPage,
    renderNewPostForm,
} from "../controllers/adminCrontroller";

const router = Router();
router.get("/", renderAdminPage);
router.get("/post/new", renderNewPostForm);

export default router;