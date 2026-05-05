import express, {request} from "express";

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

app.get("/", (_request, response) => {
    response.status(200).json({ message: "Bookmark manager API is Running"});
});

app.get("/bookmark", (_request, response)=> {
    response.status(200).json(bookmarks);
});

app.get("/bookmark/:id",(request, response)=> {
    const id = Number(request.params.id);

    const bookmark = bookmarks.find((bokmark)=> bokmark.id===id);
    if (!bookmark) {
        response.status(404).json({error:"Bookmark not found"});
        return;
    }
    response.status(200).json(bookmark);
})

app.post("/bookmarks", (request, response)=> {
    const {url, title, tag} = request.body;
    const nextId = bookmarks.length + 1;

    const newBookmark: Bookmark = {
        id: nextId,
        url,
        title,
        tag,
    };
    bookmarks.push(newBookmark);
    response.status(201).json(newBookmark);
});

app.delete("/bookmarks/:id", (request, response)=>{
    const id = Number(request.params.id);
    const bookmarksBeforeDelete = bookmarks.length;
    bookmarks = bookmarks.filter((bookmark)=> bookmark.id !==id);

    if(bookmarks.length === bookmarksBeforeDelete) {
        response.status(404).json({error: "Bookmark not found"});
        return;
    }
    response.status(204).send();
})

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
});