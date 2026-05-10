import type { Request, Response} from "express";
import {
    addPost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    slugify,
updatePost,
    type Post,
} from "../models/postModel";
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

function getPostDataFromRequestBody(body: Request["body"]): Post | null {
    const { title, image, author, teaser, content } = body;

    if (
        typeof title !== "string" ||
        typeof image !== "string" ||
        typeof author !== "string" ||
        typeof teaser !== "string" ||
        typeof content !== "string"
    ) {
        return null;
    }

    return {
        title: title.trim(),
        image: image.trim(),
        author: author.trim(),
        createdAt: Math.floor(Date.now() / 1000),
        teaser: teaser.trim(),
        content: sanitizeHtml(content, allowedHtmlOptions),
    };
}

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
    const newPost = getPostDataFromRequestBody(req.body);

    if (!newPost) {
        res.status(400).send("Invalid form data");
        return;
    }

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

export function saveEditedPost(req: Request, res: Response) {
    const slug = Array.isArray(req.params.slug)
        ? req.params.slug[0]
        : req.params.slug;

    if (!slug) {
        res.status(400).send("Missing slug");
        return;
    }

    const updatedPost = getPostDataFromRequestBody(req.body);

    if (!updatedPost) {
        res.status(400).send("Invalid form data");
        return;
    }

    const wasUpdated = updatePost(slug, updatedPost);

    if (!wasUpdated) {
        res.status(404).send("Post not found");
        return;
    }
    res.redirect("/admin");
}

export function deleteExistingPost(req: Request, res: Response) {
    const slug = Array.isArray(req.params.slug)
        ? req.params.slug[0]
        : req.params.slug;

    if (!slug) {
        res.status(400).send("Missing slug");
        return;
    }

    const wasDeleted = deletePost(slug);

    if (!wasDeleted) {
        res.status(404).send("Post not found");
        return;
    }

    res.redirect("/admin");
}