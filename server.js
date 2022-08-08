const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const modelRoutes = require("./routes/model-data");
const gameDataRoutes = require("./routes/game-data.js");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/model-data", modelRoutes);

app.use("/game-data", gameDataRoutes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});