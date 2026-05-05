import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";

const app = express();
const port = 3000;

nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (_request, response)=> {
    response.render("index.html");
});

app.listen(port, ()=> {
    console.log(`server läuft auf http//localhost:${port}`);
});