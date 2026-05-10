import type { Request, Response} from "express";
import {
    addPost,
    getAllPosts,
    getPostBySlug,
    slugify} from "../models/postModel";
import sanitizeHtml from "sanitize-html";

const allowedHtmlOptions = {
    allowedTags: [
        "p",
        "br",
        "strong",
        "em",
        "h1",
        "h2",
        "h3",
        "ul",
        "ol",
        "li",
        "a",
        "img",
    ],
    allowedAttributes: {
        a: ["href", "target", "rel"],
        img: ["src", "alt"],
    },
};

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

export function renderNewPostForm(_req: Request, res: Response) {
    res.render("adminPostForm.html", {
        pageTitle: "Create New Post",
        formAction: "/admin/posts",
        submitLabel: "Create Post",
        post: {
            title: "",
            image: "",
            author: "",
            teaser: "",
            content: "",
        },
    });
}

export function createPost(req: Request, res: Response) {
    const { title, image, author, teaser, content } = req.body;

        if(
            typeof title !== "string" ||
            typeof image !== "string" ||
            typeof author !== "string" ||
            typeof  teaser !== "string" ||
            typeof  content !== "string"
    ) {
            res.status(400).send("Invalid form data");
            return;
        }

        const newPost = {
            title: title.trim(),
            image: image.trim(),
            author: author.trim(),
            createdAt: Math.floor(Date.now() / 1000),
            teaser: teaser.trim(),

            content: sanitizeHtml(content, allowedHtmlOptions),
        };

        addPost(newPost);
        res.redirect("/admin");
}

export function renderEditPostForm(req: Request, res: Response) {
    const slug = Array.isArray(req.params.slug)
        ? req.params.slug[0]
        : req.params.slug;

    if(!slug) {
        res.status(400).send("Mussing slug");
        return;
    }
    const post = getPostBySlug(slug);

    if(!post) {
        res.status(400).send("Post not found");
        return;
    }

    res.render("adminPostForm.html", {
        pageTitle: "Edit Post",
        formAction: `/admin/posts/${slug}`,
        submitLabel: "Save Changes",
        post,
    });
}