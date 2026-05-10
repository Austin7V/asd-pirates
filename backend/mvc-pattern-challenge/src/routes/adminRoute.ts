import { Router } from "express";
import {
    createPost,
    renderAdminPage,
    renderNewPostForm,
} from "../controllers/adminController";

const router = Router();
router.get("/", renderAdminPage);
router.get("/posts/new", renderNewPostForm);
router.post("/posts", createPost);

export default router;