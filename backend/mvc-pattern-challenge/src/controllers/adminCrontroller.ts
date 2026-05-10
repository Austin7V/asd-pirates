import type { Request, Response} from "express";
import { getAllPosts, slugify} from "../models/postModel";

export function renderAdminPage(_req: Request, res: Response) {
    const posts = getAllPosts();
    const viewPosts = posts.map((post)=> ({
        ...post,
        slug: slugify(post.title),
    }));
    res.render("admin.html", {
        posts:viewPosts,
    });
}