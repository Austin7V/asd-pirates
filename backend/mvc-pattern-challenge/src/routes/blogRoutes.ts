import { Router } from "express";
import {
    renderAboutPage,
    renderContactPage,
    renderExamplePostPage,
    renderHomePage,
    renderPostDetailPage,
} from "../controllers/blogController";

const router = Router();

router.get("/", renderHomePage);
router.get("/posts/:slug", renderPostDetailPage);
router.get("/contact", renderContactPage);
router.get("/about", renderAboutPage);
router.get("/example-post", renderExamplePostPage);

export default router;