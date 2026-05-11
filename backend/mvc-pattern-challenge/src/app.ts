import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import blogRoutes from "./routes/blogRoutes";
import adminRoute from "./routes/adminRoute";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(projectRoot, "src", "assets");
const cssDir = path.join(projectRoot, "src", "css");

nunjucks.configure(projectRoot, { autoescape: true, express: app });
app.use("/assets", express.static(assetsDir));
app.use("/css", express.static(cssDir));

app.use(express.urlencoded({ extended: true }));

app.use("/", blogRoutes);
app.use("/admin", adminRoute);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
