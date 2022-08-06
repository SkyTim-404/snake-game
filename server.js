const express = require("express");
const path = require("path");
const modelRoutes = require("./routes/model");
const gameDataRoutes = require("./routes/game-data.js");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use("/model", modelRoutes);

app.use("/game-data", gameDataRoutes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});