import express from "express";

interface Bookmark {
    id: number;
    url: string;
    title: string;
    tag?: string;
}

const app = express();

const port = 3000;

app.use(express.json());

let bookmarks: Bookmark[] = [
    { id: 1, url: "https://expressjs.com", title: "Express.js", tag: "node" },
    {
        id: 2,
        url: "https://typescriptlang.org",
        title: "TypeScript",
        tag: "typescript",
    },
    { id: 3, url: "https://developer.mozilla.org", title: "MDN Web Docs" },
];

app.get("/", (request, response) => {
    response.status(200).json({ message: "Bookmark manager API is Running"});
});

app.get("/bookmark", (request, response)=> {
    response.status(200).json(bookmarks);
});

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
});