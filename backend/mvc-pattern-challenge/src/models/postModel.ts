import fs from "node:fs";
import path from "node:path";

export interface Post {
    title: string;
    image: string;
    author: string;
    createdAt: number;
    teaser: string;
    content: string;
}

const postsFilePath = path.join(process.cwd(), "src", "data", "posts.json");

export function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function getAllPosts(): Post[] {
    const postsJson = fs.readFileSync(postsFilePath, "utf-8");

    const posts = JSON.parse(postsJson) as Post[];
    return [...posts];
}

export function getPostBySlug(slug: string): Post | undefined {
    return getAllPosts().find((post) => slugify(post.title) === slug);
}

export function writePosts(posts: Post[]): void {
    const postsJson = JSON.stringify(posts, null, 2);
    fs.writeFileSync(postsFilePath, postsJson, "utf-8");
}

export function addPost(post: Post): void {
    const posts = getAllPosts();
    const updatedPosts = [post, ...posts];
    writePosts(updatedPosts);
}

export function updatePost(slug: string, changes: Post): boolean {
    const posts = getAllPosts();
    const postIndex = posts.findIndex((post)=> slugify(post.title) === slug);

    if (postIndex === -1) {
        return false;
    }
    posts[postIndex]=changes;

    writePosts(posts);
    return true;
}

export interface Post {
    title: string;
    image: string;
    author: string;
    createdAt: number;
    teaser: string;
    content: string;
}

export function deletePost(slug:string): boolean {
    const posts = getAllPosts();
    const updatePosts = posts.filter((post) => slugify(post.title) !== slug);

    if(updatePosts.length === posts.length) {
        return false;
    }

    writePosts(updatePosts);
    return true;
}