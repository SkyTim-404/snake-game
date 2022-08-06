const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {

});

router.post("/", (req, res) => {
    const model = req.body;
    fs.writeFile("data/test.txt", "123", function(err) {
        if (err) {
            console.log(err);
        }
    });
});

module.exports = router;