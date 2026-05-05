import express, {response} from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import fs from "node:fs/promises"
import * as crypto from "node:crypto";

const app = express();
const port = 3000;

const messagesDirectory = path.join(process.cwd(), "messages");
function sanitizeMessage(message: string) {
    return message
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (_request, response)=> {
    response.render("index.html");
});

app.post("/messages", async (request, response) => {
    const message = request.body.message;
    if (typeof message !=="string" || !message.trim()) {
        response.status(400).send("Message is required");
        return;
    }
    const sanitizedMessage = sanitizeMessage(message);
    const messageId = crypto.randomUUID();
    const messagePath = path.join(messagesDirectory, `${messageId}.txt`);

    await fs.writeFile(messagePath, sanitizedMessage, "utf-8");

    const link = `/messages/${messageId}`;

    response.status(201).render("result.html", { link });
})

app.get("/messages/:id", async (request, responce)=> {
    const messageId = request.params.id;
    if (!messageId) {
        response.status(404).render("not-dound.html");
        return;
    }

    const messagePath = path.join(messagesDirectory, `${messageId}.txt`);
    try {
        const message = await fs.readFile(messagePath, "utf-8");
        await fs.unlink(messagePath);
        responce.status(200).render("message.html", { message });
    } catch {
        response.status(404).render("not-found.html");
    }
});

app.listen(port, ()=> {
    console.log(`server läuft auf http//localhost:${port}`);
});