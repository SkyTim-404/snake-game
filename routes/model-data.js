const express = require("express");
const router = express.Router();
const fs = require("fs");

const dir = "./data/";

router.get("/", (req, res) => {
    let filename = req.query.filename;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (!fs.existsSync(dir+filename)) {
        fs.writeFileSync(dir+filename, JSON.stringify({}), (err) => {
            if (err) console.log(err);
        });
    }
    res.send(require("../" + dir + filename));
});

router.post("/", (req, res) => {
    let model = req.body;
    let filename = req.body.filename;
    delete model.filename;
    delete model.relu;
    //check dir exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    //write file
    fs.writeFileSync(dir+filename, JSON.stringify(model), (err) => {
        if (err) {
            console.log("write model data error: " + err);
        }
    });
    res.json({ msg: "success" });
});

module.exports = router;