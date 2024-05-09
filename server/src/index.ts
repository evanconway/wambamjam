import express from "express";
import path from "path";

const staticFilesRelativeDir = "../../client/dist";

const app = express();

app.use(express.static(path.join(__dirname, staticFilesRelativeDir)));

const port = 3000;
app.listen(port, () => {
  console.log(`app is running at http://localhost:${port}`);
});
