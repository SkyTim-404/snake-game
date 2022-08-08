const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const modelRoutes = require("./routes/model-data");
const gameDataRoutes = require("./routes/game-data.js");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/model-data", modelRoutes);

app.use("/game-data", gameDataRoutes);

app.post("/delete", (req, res) => {
    let info = req.body;
    let dir = "./data";
    if (info.delete) {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    }
    res.json({ msg: "success" });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});