import express, {request, response} from "express";
import nunjucks from "nunjucks";
import posts from "./data/posts.json"

const app = express();
const port = 3000;

const events = [
    {
        name: "React Conf",
        date: "June 10, 2025",
        location: "Berlin",
        soldOut: false,
    },
    {
        name: "Vue.js Summit",
        date: "July 2, 2025",
        location: "Amsterdam",
        soldOut: true,
    },
    {
        name: "Node.js Interactive",
        date: "August 15, 2025",
        location: "London",
        soldOut: false,
    },
];

nunjucks.configure("views", {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true,
});

app.get("/", (req, res) => {
    res.render("index.html");
});

app.get("/events", (request, response) => {
    response.render("events.html", {
        events,
    });
});

app.get("/posts", (req, res)=> {
    res.json("posts");
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});