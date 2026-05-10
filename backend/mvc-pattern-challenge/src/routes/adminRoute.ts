import { Router } from "express";
import {
    createPost,
    renderAdminPage,
    renderEditPostForm,
    renderNewPostForm,
    saveEditedPost
} from "../controllers/adminController";

const router = Router();
router.get("/", renderAdminPage);
router.get("/posts/new", renderNewPostForm);
router.post("/posts", createPost);
router.get("/posts/:slug/edit", renderEditPostForm);
router.post("/posts/:slug", saveEditedPost);

export default router;