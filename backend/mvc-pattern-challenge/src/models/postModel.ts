export interface Post {
    title: string;
    image: string;
    author: string;
    createdAt: number;
    teaser: string;
    content: string;
}

const seedPosts: Post[] = [
    {
        title: "Black: The Absence, Not the Presence, of Color",
        image: "colorful-umbrella.jpg",
        author: "Peter Parker",
        createdAt: 1743120000,
        teaser:
            "Scientifically, black is not a color but rather the absence of all colors, occurring when an object absorbs nearly all light wavelengths instead of reflecting them.",
        content:
            "<p>When you think about the rainbow, you see a vibrant spectrum of hues. But black does not appear in that spectrum the same way red or blue does.</p><p>From a scientific perspective, black is usually the absence of visible light, not a reflected wavelength.</p>",
    },
    {
        title: "Flowers: Nature's Muse for Design",
        image: "flowers.jpg",
        author: "Peter Parker",
        createdAt: 1745452800,
        teaser:
            "Flowers inspire design with their color palettes, structure, and balance between repetition and variation.",
        content:
            "<p>Designers borrow from flowers all the time: layered composition, contrasting accents, and natural hierarchy.</p>",
    },
    {
        title: "UDesign's Harmony: Core Purpose and Supporting Details",
        image: "sailing.jpg",
        author: "Peter Parker",
        createdAt: 1748736000,
        teaser:
            "Strong design starts with one clear core idea, then adds supporting details that reinforce it.",
        content:
            "<p>A useful mental model is major and minor elements. Major elements communicate the main point, minor elements support it without stealing focus.</p>",
    },
];

export function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function getAllPosts(): Post[] {
    return seedPosts;
}

export function getPostBySlug(slug: string): Post | undefined {
    return seedPosts.find((post) => slugify(post.title) === slug);
}

export function writePosts(posts: Post[]): void {
    seedPosts.length = 0;
    seedPosts.push(...posts);
}

export function addPost(post: Post): void {
    const posts = getAllPosts();
    const updatedPosts = [post, ...posts];
    writePosts(updatedPosts);
}