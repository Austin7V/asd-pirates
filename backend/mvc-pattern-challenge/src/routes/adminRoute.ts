import { Router } from "express";
import {
    createPost,
    renderAdminPage,
    renderEditPostForm,
    renderNewPostForm,
} from "../controllers/adminController";

const router = Router();
router.get("/", renderAdminPage);
router.get("/posts/new", renderNewPostForm);
router.post("/posts", createPost);
router.get("/posts/:slug/edit", renderEditPostForm);

export default router;