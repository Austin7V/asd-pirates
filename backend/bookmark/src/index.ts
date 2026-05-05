import express from "express";

const app = express();

const port = 3000;

app.use(express.json());

app.get("/", (request, response) => {
    response.status(200).json({ message: "Bookmark manager API is Running"});
});

app.listen(port, ()=> {
    console.log(`Server is running on http://localgost:${port}`);
});