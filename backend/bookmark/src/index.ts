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

app.get("/bookmarks", (request, response)=> {
    const tag = request.query.tag;

    if (!tag) {
        response.status(200).json(bookmarks);
        return;
    }
    if(typeof tag !=="string") {
        response.status(400).json({error: "Invalid tag query parameter"});
        return;
    }
    const filteredBookmarks = bookmarks.filter((bookmarks) => bookmarks.tag === tag);

    response.status(200).json(filteredBookmarks);
});

app.get("/bookmarks/:id",(request, response)=> {
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

    if(!url) {
        response.status(400).json({error: "Missing required field: url"});
        return;
    }
    if(!title) {
        response.status(400).json({error: "Missing required field: title"});
        return;
    }

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

app.patch("/bookmarks/:id", (request, response)=> {
    const id = Number(request.params.id);
    const bookmarkIndex = bookmarks.findIndex((bookmarks)=> bookmarks.id === id);

    if(bookmarkIndex === -1) {
        response.status(404).json({error: "Bookmark not found"});
        return;
    }

    const { url, title, tag} = request.body;
    const oldBookmark = bookmarks[bookmarkIndex];
    if(!oldBookmark) {
        response.status(404).json({error: "Bookmark not found"});
        return;
    }

    const updatedBookmark: Bookmark = {
        ...oldBookmark,
        url: url ?? oldBookmark.url,
        title: title ?? oldBookmark.title,
        tag: tag ?? oldBookmark.tag,
    };

    bookmarks[bookmarkIndex] = updatedBookmark;
    response.status(200).json(updatedBookmark);
})

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
});